import './App.css';
import Auth from './auth/auth';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './Home/Home';
import { AuthProvider, useAuth } from './auth/AuthProvider';

function App() {
  const { token } = useAuth();

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Switch>
            <Route path={['/login', '/signup']}>
              {token ? <Redirect to="/home" /> : <Auth />}
            </Route>
            {
              token ?
                <Route path={['/home', '/']}>
                  <Home />
                </Route> : <Redirect to="/login" />
            }
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
