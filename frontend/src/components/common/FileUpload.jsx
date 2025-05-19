import React, { useRef } from 'react';

/**
 * File upload component
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Change handler
 * @param {string} props.name - Field name
 * @param {string} props.label - Field label
 * @param {string} props.accept - Accepted file types
 * @param {string} props.error - Error message
 * @param {string} props.fileName - Current file name
 */
const FileUpload = ({
  onChange,
  name,
  label,
  accept = ".pdf,.docx",
  error,
  fileName,
  required = false,
  className = ''
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    onChange(e, name);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={`file-${name}`} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="flex items-center space-x-2">
        <input
          type="file"
          id={`file-${name}`}
          name={name}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
          required={required}
        />
        
        <button
          type="button"
          onClick={handleButtonClick}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Choose file
        </button>
        
        <div className="text-sm text-gray-500 truncate">
          {fileName ? fileName : 'No file selected'}
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        Accepted file types: PDF, DOCX (Max 10MB)
      </p>
    </div>
  );
};

export default FileUpload;