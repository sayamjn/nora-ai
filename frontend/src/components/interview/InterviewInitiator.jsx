import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import FileUpload from '../common/FileUpload';
import useFileUpload from '../../hooks/useFileUpload';
import useInterview from '../../hooks/useInterview';

const InterviewInitiator = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const { 
    files, 
    fileNames, 
    errors: fileErrors, 
    handleFileChange, 
    createFormData 
  } = useFileUpload();
  const { handleCreateInterview, loading } = useInterview();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const errors = {};
    
    if (!jobTitle.trim()) {
      errors.jobTitle = 'Job title is required';
    }
    
    if (!files.resume) {
      errors.resume = 'Resume is required';
    }
    
    if (!files.jobDescription) {
      errors.jobDescription = 'Job description is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData = createFormData({ jobTitle });
    
    await handleCreateInterview(formData);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Start New Interview</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="jobTitle" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className={`w-full px-3 py-2 border ${
              formErrors.jobTitle ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter job title"
            required
          />
          {formErrors.jobTitle && (
            <p className="mt-1 text-sm text-red-600">{formErrors.jobTitle}</p>
          )}
        </div>
        
        <FileUpload
          name="resume"
          label="Resume"
          onChange={handleFileChange}
          error={fileErrors.resume || formErrors.resume}
          fileName={fileNames.resume}
          required
        />
        
        <FileUpload
          name="jobDescription"
          label="Job Description"
          onChange={handleFileChange}
          error={fileErrors.jobDescription || formErrors.jobDescription}
          fileName={fileNames.jobDescription}
          required
        />
        
        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="secondary"
            className="mr-3"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            disabled={loading}
          >
            Start Interview
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InterviewInitiator;