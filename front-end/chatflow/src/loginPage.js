import React, { useState } from 'react';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent page reload
  
      const credentials = { email, password };
        
      try {
        const response = await fetch('http://127.0.0.1:8443/api/users/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Login successful:', data);
          // Handle success (e.g., store user data, redirect to another page)
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Login failed');
          console.error('Login failed:', errorData);
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again.');
        console.error('Error:', error);
      }
    };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button onClick={handleSubmit} type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
