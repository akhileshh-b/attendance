import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await api.getAttendance(selectedDate);
      const attendanceData = response.data?.subjects.reduce((acc, subject) => {
        acc[subject.name] = subject.status;
        return acc;
      }, {});
      
      // Initialize attendance for subjects without records
      user.subjects.forEach((subject) => {
        if (!attendanceData[subject]) {
          attendanceData[subject] = 'absent';
        }
      });
      
      setAttendance(attendanceData);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (subject, status) => {
    setAttendance((prev) => ({
      ...prev,
      [subject]: status,
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const subjects = Object.entries(attendance).map(([name, status]) => ({
        name,
        status,
      }));

      await api.markAttendance(selectedDate, subjects);
      setSuccess('Attendance marked successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input w-auto"
            />
          </div>
        </div>
        
        {/* Attendance Form */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {user.subjects.map((subject) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-900">{subject}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAttendanceChange(subject, 'present')}
                      className={`px-4 py-2 rounded-md transition-all duration-200 ${
                        attendance[subject] === 'present'
                          ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(subject, 'absent')}
                      className={`px-4 py-2 rounded-md transition-all duration-200 ${
                        attendance[subject] === 'absent'
                          ? 'bg-red-600 text-white shadow-md hover:bg-red-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Error and Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 bg-green-50 text-green-600 p-4 rounded-lg border border-green-200"
              >
                {success}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                'Save Attendance'
              )}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard; 