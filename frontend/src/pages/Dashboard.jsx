import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import FeedbackCard from '../components/feedback/FeedbackCard';
import { getInterviews, getAllFeedbacks } from '../services/interviewService';

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('interviews');
  
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching interviews and feedbacks...');
      
      const interviewsResponse = await getInterviews();
      console.log('Interviews response:', interviewsResponse);
      
      if (interviewsResponse.success) {
        setInterviews(interviewsResponse.data);
      } else {
        setError(interviewsResponse.message || 'Failed to fetch interviews');
      }
      
      const feedbacksResponse = await getAllFeedbacks();
      console.log('Feedbacks response:', feedbacksResponse);
      
      if (feedbacksResponse.success) {
        setFeedbacks(feedbacksResponse.data);
      } else {
        setError(feedbacksResponse.message || 'Failed to fetch feedbacks');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/interviews/new">
          <Button variant="primary">
            Start New Interview
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('interviews')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'interviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Interviews
            </button>
            <button
              onClick={() => setActiveTab('feedbacks')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feedbacks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Feedbacks
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'interviews' && (
        <div>
          {interviews.length > 0 ? (
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Feedback
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interviews.map((interview) => (
                      <tr key={interview._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {interview.jobTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(interview.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(interview.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {interview.feedback ? (
                            <Link 
                              to={`/feedback/${interview.feedback}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View Feedback
                            </Link>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              {interview.status === 'completed' ? 'Generating...' : 'Not available'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link 
                            to={`/interviews/${interview._id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {interview.status === 'pending' ? 'Start' : 'View'}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500 mb-4">You haven't created any interviews yet.</p>
              <Link to="/interviews/new">
                <Button variant="primary">
                  Start Your First Interview
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'feedbacks' && (
        <div>
          {feedbacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.map((feedback) => (
                <FeedbackCard key={feedback._id} feedback={feedback} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500 mb-4">You don't have any feedback yet.</p>
              <Link to="/interviews/new">
                <Button variant="primary">
                  Start an Interview
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;