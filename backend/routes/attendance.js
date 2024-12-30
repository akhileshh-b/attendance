const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

// Mark attendance for a specific date
router.post('/', auth, async (req, res) => {
    try {
        const { date, subjects } = req.body;

        // Check if attendance already exists for this date
        let attendance = await Attendance.findOne({
            user: req.user._id,
            date: new Date(date)
        });

        if (attendance) {
            // Update existing attendance
            attendance.subjects = subjects;
            await attendance.save();
        } else {
            // Create new attendance record
            attendance = new Attendance({
                user: req.user._id,
                date: new Date(date),
                subjects
            });
            await attendance.save();
        }

        res.json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get attendance for a specific date
router.get('/date/:date', auth, async (req, res) => {
    try {
        const attendance = await Attendance.findOne({
            user: req.user._id,
            date: new Date(req.params.date)
        });
        res.json(attendance || { subjects: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get attendance statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const attendances = await Attendance.find({ user: req.user._id });
        
        // Calculate statistics for each subject
        const stats = {};
        req.user.subjects.forEach(subject => {
            const subjectAttendances = attendances.filter(a => 
                a.subjects.some(s => s.name === subject)
            );
            
            const presentCount = subjectAttendances.filter(a => 
                a.subjects.find(s => s.name === subject).status === 'present'
            ).length;
            
            const totalCount = subjectAttendances.length;
            
            stats[subject] = {
                present: presentCount,
                absent: totalCount - presentCount,
                percentage: totalCount > 0 ? (presentCount / totalCount) * 100 : 0
            };
        });

        // Calculate overall statistics
        const totalPresent = attendances.reduce((sum, a) => 
            sum + a.subjects.filter(s => s.status === 'present').length, 0);
        const totalClasses = attendances.reduce((sum, a) => 
            sum + a.subjects.length, 0);
        
        const overallStats = {
            totalPresent,
            totalAbsent: totalClasses - totalPresent,
            percentage: totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0
        };

        res.json({
            subjectStats: stats,
            overallStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get attendance history
router.get('/history', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { user: req.user._id };
        
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const attendances = await Attendance.find(query)
            .sort({ date: -1 });
        
        res.json(attendances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 