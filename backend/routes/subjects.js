const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user's subjects
router.get('/', auth, async (req, res) => {
    try {
        res.json({ subjects: req.user.subjects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new subject
router.post('/', auth, async (req, res) => {
    try {
        const { subject } = req.body;
        
        if (!subject) {
            return res.status(400).json({ message: 'Subject name is required' });
        }

        if (req.user.subjects.includes(subject)) {
            return res.status(400).json({ message: 'Subject already exists' });
        }

        req.user.subjects.push(subject);
        await req.user.save();

        res.json({ subjects: req.user.subjects });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete subject
router.delete('/:subject', auth, async (req, res) => {
    try {
        const subject = req.params.subject;
        
        if (!req.user.subjects.includes(subject)) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        req.user.subjects = req.user.subjects.filter(s => s !== subject);
        await req.user.save();

        res.json({ subjects: req.user.subjects });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 