import React from 'react';

const CongratulationsModal = ({ goMain }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>🎉 축하해요! 학습을 마쳤어요! 🎉</h2>
        <button style={styles.button} onClick={goMain}>메인으로 가기</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    animation: 'dropDown 0.5s ease-out forwards', // 아래로 떨어지는 애니메이션
    position: 'absolute',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4A90E2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  '@keyframes dropDown': {
    '0%': {
      transform: 'translateY(-100vh)', // 화면 위에서 시작
    },
    '100%': {
      transform: 'translateY(100vh)', // 화면 중앙에 위치
    },
  },
};

export default CongratulationsModal;