import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const Profile = () => {
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [newSubject, setNewSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');

  useEffect(() => {
    // Clear the location state after showing the message
    if (location.state?.message) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      setError('Please enter a subject name');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // First add the subject
      await api.addSubject(newSubject.trim());
      
      // Then update the user's subjects list
      const updatedSubjects = [...(user.subjects || []), newSubject.trim()];
      await api.updateSubjects(updatedSubjects);
      
      // Update local state
      updateUser({ ...user, subjects: updatedSubjects });
      setNewSubject('');
      setSuccess('Subject added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subject');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (subjectToDelete) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // First delete the subject
      await api.deleteSubject(subjectToDelete);
      
      // Then update the user's subjects list
      const updatedSubjects = user.subjects.filter(
        (subject) => subject !== subjectToDelete
      );
      await api.updateSubjects(updatedSubjects);
      
      // Update local state
      updateUser({ ...user, subjects: updatedSubjects });
      setSuccess('Subject deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          {location.state?.isNewUser && (
            <span className="badge badge-success">New User</span>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">User Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Name: <span className="text-gray-900">{user.name}</span></p>
            <p className="text-gray-600">Email: <span className="text-gray-900">{user.email}</span></p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Subjects</h3>
          
          {/* Add Subject Form */}
          <form onSubmit={handleAddSubject} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Enter subject name"
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Add Subject'
                )}
              </button>
            </div>
          </form>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 text-green-600 p-4 rounded-lg mb-4"
            >
              {success}
            </motion.div>
          )}

          {/* Subjects List */}
          <div className="space-y-2">
            {user.subjects?.length > 0 ? (
              user.subjects.map((subject, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-900">{subject}</span>
                  <button
                    onClick={() => handleDeleteSubject(subject)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  >
                    ✕
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No subjects added yet. Add your first subject above!
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile; 