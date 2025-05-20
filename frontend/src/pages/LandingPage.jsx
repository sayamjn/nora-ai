import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';

const LandingPage = () => {
  const { isAuth } = useAuth();
  
  return (
    <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
      <div className="max-w-7xl mx-auto lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
            <div className="lg:py-24">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:text-5xl lg:mt-6">
                <span className="block">Practice interviews</span>
                <span className="block text-blue-600">with AI feedback</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg">
                Upload your resume and a job description, then get interviewed by our AI. 
                Receive detailed feedback to help you prepare for your real interview.
              </p>
              <div className="mt-8 sm:mt-12">
                {isAuth ? (
                  <Link to="/dashboard">
                    <Button variant="primary" className="px-8 py-3 text-base font-medium">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <div className="space-x-4">
                    <Link to="/register">
                      <Button variant="primary" className="px-8 py-3 text-base font-medium">
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="secondary" className="px-8 py-3 text-base font-medium">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          

        </div>
      </div>
      
      <div className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why use Nora AI?
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Practice makes perfect. Our AI-powered interview platform helps you prepare for your next job interview.
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Tailored Questions
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Our AI analyzes your resume and the job description to ask relevant, challenging questions specific to your background and the role.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Practice Anytime
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      No scheduling needed. Practice interviews whenever you want, as many times as you need to feel confident.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Detailed Feedback
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get comprehensive feedback on your strengths and areas for improvement, with specific suggestions to enhance your interview performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;