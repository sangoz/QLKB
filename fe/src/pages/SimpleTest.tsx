import React from 'react';

const SimpleTest = () => {
  return (
    <div style={{ padding: '20px', fontSize: '24px' }}>
      <h1>Simple Test Page</h1>
      <p>If you can see this, React is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default SimpleTest;
