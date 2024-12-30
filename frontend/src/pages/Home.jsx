import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Easy Attendance Tracking',
    description: 'Mark your attendance with just a few clicks for any date.',
    icon: CalendarIcon,
  },
  {
    name: 'Subject Management',
    description: 'Add and manage your subjects effortlessly.',
    icon: UserGroupIcon,
  },
  {
    name: 'Detailed Statistics',
    description: 'View your attendance statistics with beautiful charts.',
    icon: ChartBarIcon,
  },
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="mb-6">
              Track Your Attendance Effortlessly
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              A simple and intuitive way to manage your academic attendance. Stay on top of your classes with detailed statistics and insights.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="btn btn-secondary">
                Get Started
              </Link>
              <Link to="/login" className="btn bg-blue-500 text-white hover:bg-blue-600">
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Features that make attendance tracking a breeze
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your attendance effectively
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="feature-card"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100 text-blue-600">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 