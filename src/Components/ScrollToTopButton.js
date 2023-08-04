// ScrollToTopButton.js
import React, { useState, useEffect } from 'react';
import { VerticalAlignTopOutlined } from '@ant-design/icons';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    setIsVisible(scrollTop > 300); // Show the button when user scrolls down more than 300 pixels
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Add smooth scrolling animation
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const buttonStyle = {
    position: 'fixed',
    bottom: '5px',
    right: '23px',
    width: '40px',
    height: '40px',
    backgroundColor: '#6643b5',
    color: 'red',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s',
    zIndex: 1000,
    boxShadow: '0px 4px 6px -2px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={buttonStyle} onClick={scrollToTop}>
        <VerticalAlignTopOutlined style={{color: 'white', fontSize: '23px'}} />
    </div>
  );
};

export default ScrollToTopButton;
