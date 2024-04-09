import React, { useContext, useState } from 'react';
import axios from 'axios';
import { LoadingContext } from './LoadingContext';
import { handleCustomAlert } from './handleCustomAlert';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const { setIsLoading } = useContext(LoadingContext);

  const handleDeleteFile = () => {
    setFileName('');
    setFile(null);
    document.getElementById('fileInput').value = '';
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleUpload = async () => {
    try {
      // Create a FormData object to send the file to the server
      if (!file || (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel')) {
        handleCustomAlert('Invalid File', 'Please upload a CSV file', 'danger');

        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      console.log(formData);
      setIsLoading(true);
      // Send the file to the server using Axios
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      handleCustomAlert('File Uploaded', response.data, 'success');
    } catch (error) {
      if (error.response.status === 400) {
        handleCustomAlert('', error.response.data, 'danger');
      }
      console.error('Error uploading file:', error.message);
      handleCustomAlert('Error', 'Error uploading file. Please try again.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '3rem',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#eaf8ff',
        borderRadius: '2rem',
        marginBottom: '3rem',
        border: '2px dashed #395fac',
        gap: '2rem',
        flexWrap: 'wrap',
      }}
    >
      <label
        htmlFor="fileInput"
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '10px',
          padding: '0 3rem',
          backgroundColor: 'none',
          color: '#2d6ed4',
          cursor: 'pointer',
          border: '2px solid #2d6ed4',
          fontWeight: '600',
          fontSize: '0.9rem',
        }}
      >
        {fileName || 'Choose File'}
        <input id="fileInput" style={{ display: 'none' }} type="file" accept=".csv" onChange={handleFileChange} />
      </label>
      {fileName && (
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
            padding: '0 1rem',
            backgroundColor: 'none',
            color: 'red',
            cursor: 'pointer',
            border: '2px solid red',
            fontWeight: '600',
            fontSize: '0.9rem',
          }}
          onClick={handleDeleteFile}
        >
          Delete File
        </button>
      )}
      <button
        style={{
          borderRadius: ' 10px',
          border: 'hidden',
          backgroundColor: '#235ed8',
          color: 'white',
          fontWeight: 600,
          padding: '0.4rem  1rem ',
          fontSize: '0.9rem',
        }}
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
