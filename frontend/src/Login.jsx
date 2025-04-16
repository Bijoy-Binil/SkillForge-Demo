import React from 'react';

function Login() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Login Page</h1>
      <div className="test-box">
        If you can see this box in blue color with white text, CSS is working!
      </div>
      <button className="btn btn-primary">Primary Button</button>
      <button className="btn btn-secondary" style={{ marginLeft: '10px' }}>Secondary Button</button>
    </div>
  );
}

export default Login; 