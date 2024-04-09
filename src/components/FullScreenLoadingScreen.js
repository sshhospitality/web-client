import React, { useContext } from 'react';
import { LoadingContext } from './LoadingContext';
import SpinnerLoadingScreen from './SpinnerLoadingScreen';

const FullScreenLoadingScreen = () => {
  const { isLoading } = useContext(LoadingContext);
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        color: 'white',
        fontSize: '1.5rem',
      }}
    >
      {/* DO NOT DELETE! WILL THIS USE LATER */}
      {/* <Typography
        variant="h4"
        fontFamily={'sans-serif'}
        style={{
          marginRight: '2rem',
          backdropFilter: 'blur(5px)',
          borderRadius: '15px',
        }}
      >
        {' '}
        Uploading...
      </Typography> */}
      <SpinnerLoadingScreen />
    </div>
  );
};

export default FullScreenLoadingScreen;
