import { useState } from 'react';


const useFileUpload = () => {
  const [files, setFiles] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Handle file selection
   * @param {Event} e - Change event
   * @param {string} fieldName - Form field name
   */
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: null }));
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrors(prev => ({ 
        ...prev, 
        [fieldName]: `File size exceeds 10MB limit` 
      }));
      return;
    }
    
    const allowedTypes = ['.pdf', '.docx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setErrors(prev => ({ 
        ...prev, 
        [fieldName]: `Only ${allowedTypes.join(', ')} files are allowed` 
      }));
      return;
    }
    
    setFiles(prev => ({ ...prev, [fieldName]: file }));
    setFileNames(prev => ({ ...prev, [fieldName]: file.name }));
  };

  /**
   * Create form data with files
   * @param {Object} additionalData - Additional form data
   * @returns {FormData} - FormData object with files
   */
  const createFormData = (additionalData = {}) => {
    const formData = new FormData();
    
    Object.keys(files).forEach(key => {
      formData.append(key, files[key]);
    });
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });
    
    return formData;
  };


  const resetFiles = () => {
    setFiles({});
    setFileNames({});
    setErrors({});
  };

  return {
    files,
    fileNames,
    loading,
    errors,
    setLoading,
    handleFileChange,
    createFormData,
    resetFiles
  };
};

export default useFileUpload;