import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';

const LoadingSpinner = () => (
  <div style={styles.container}>
    <SettingsIcon style={styles.gear} />
  </div>
);

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  gear: {
    fontSize: 40, 
    color: '#3f51b5', 
    animation: 'spin 2s linear infinite', 
  },
};

export default LoadingSpinner;