import React, { useState, useRef } from 'react';

const SliderButton = ({ duration, circleColor, barColor, onComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent default scrolling behavior
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const sliderWidth = sliderRef.current.offsetWidth - 60; // Adjusted for button size
    let newTranslateX = e.clientX - sliderRef.current.getBoundingClientRect().left - 30;

    if (newTranslateX < 0) {
      newTranslateX = 0;
    } else if (newTranslateX > sliderWidth) {
      newTranslateX = sliderWidth;
    }

    setTranslateX(newTranslateX);

    if (newTranslateX === sliderWidth) {
      onComplete();
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const sliderWidth = sliderRef.current.offsetWidth - 60; // Adjusted for button size
    let newTranslateX = touch.clientX - sliderRef.current.getBoundingClientRect().left - 30;

    if (newTranslateX < 0) {
      newTranslateX = 0;
    } else if (newTranslateX > sliderWidth) {
      newTranslateX = sliderWidth;
    }

    setTranslateX(newTranslateX);

    if (newTranslateX === sliderWidth) {
      onComplete();
    }

    e.preventDefault(); // Prevent default scrolling behavior
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (translateX < sliderRef.current.offsetWidth - 60) {
      setTranslateX(0); // Reset position if not fully dragged
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateX < sliderRef.current.offsetWidth - 60) {
      setTranslateX(0); // Reset position if not fully dragged
    }
  };

  return (
    <div
      ref={sliderRef}
      style={{
        ...styles.sliderContainer,
        backgroundColor: barColor,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <div style={styles.duration}>{duration}</div>
      <div
        style={{
          ...styles.circle,
          backgroundColor: circleColor,
          transform: `translateX(${translateX}px)`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        ➔
      </div>
    </div>
  );
};

const styles = {
  sliderContainer: {
    width: '100%',
    height: '40px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    padding: '0 5px',
    boxSizing: 'border-box',
    touchAction: 'none', // Disable default touch action to prevent scrolling
  },
  duration: {
    position: 'absolute',
    left: '45px',
    color: '#666',
    fontSize: '14px',
    pointerEvents: 'none',
  },
  circle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    position: 'absolute',
    zIndex: 2,
    left: '0px',
    transition: 'transform 0.1s ease',
  },
};

export default SliderButton;
