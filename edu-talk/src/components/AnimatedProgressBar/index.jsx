import React from 'react';

const AnimatedProgressBar = () => {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.dot, animationDelay: '0s' }} />
      <div style={{ ...styles.dot, animationDelay: '0.5s' }} />
      <div style={{ ...styles.dot, animationDelay: '1s' }} />
      <div style={{ ...styles.dot, animationDelay: '1.5s' }} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '200px',
    height: '40px',
    position: 'relative',
  },
  dot: {
    width: '10px',
    height: '10px',
    backgroundColor: '#FFAA00',
    borderRadius: '50%',
    position: 'absolute',
    animation: 'moveDots 3s infinite',
  },
  '@keyframes moveDots': {
    '0%': { transform: 'translateX(-80px)' },
    '25%': { transform: 'translateX(-20px)' },
    '50%': { transform: 'translateX(0)' },
    '75%': { transform: 'translateX(20px)' },
    '100%': { transform: 'translateX(80px)' },
  },
};

export default AnimatedProgressBar;
