import React, { useState, useEffect } from 'react';
import { departmentAPI } from '../services/api';

const APITest = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true);
        console.log('Testing API...');
        
        const response = await departmentAPI.getAll();
        console.log('Response:', response);
        
        setData(response);
      } catch (err: any) {
        console.error('API Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div>
          <h2>Success!</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default APITest;
