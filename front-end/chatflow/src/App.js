import './App.css';
import Auth from './auth/auth';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Home from './Home/Home';
import { useState, useEffect } from 'react';


function grandAccess() {
  const isAuthFunc = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8443/api/users/access/", {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Access:', data);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Access denied:', errorData);
        return false;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return false;
    }
  }
  return isAuthFunc();
}

function ProtectedRoute({ children }) {
  const history = useHistory(); // For React Router v6
  const [isAuth, setAuth] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await grandAccess();
      if (authStatus === true) {
        setAuth(true);
        console.log('Redirecting to home');
        history.push('/home');
      } else {
        setAuth(false);
        history.push('/login');
      }
    };

    checkAuth();
  }, [history]);

  return isAuth ? children : null;
}

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path={['/login', '/signup']}><Auth /></Route>
          <Route path={['/home', '/']}><ProtectedRoute><Home /></ProtectedRoute></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
