import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const FloatingButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/lps/create');
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        backgroundColor: '#ec4899',
        border: 'none',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#db2777';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#ec4899';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <FiPlus size={24} color="white" />
    </button>
  );
};

export default FloatingButton;


