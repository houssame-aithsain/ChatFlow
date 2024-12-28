import './App.css';
import Auth from './auth/auth';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import { useState, useEffect } from 'react';


function ProtectedRoute({children}) {
  const history = useHistory();
  const [isAuth, setAuth] = React.useState(false);

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
        setAuth(true);
      } else {
        const errorData = await response.json();
        console.error('Access denied:', errorData);
        setAuth(false);
        history.push('/login');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  React.useEffect(() => {
    isAuthFunc();
  }, []);

  return isAuth ? children : null;
}

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path={['/login', '/signup']}><Auth /></Route>
          {/* <Route path={['/home', '/']}><ProtectedRoute><Home /></ProtectedRoute></Route> */}
          <Route path={['/home', '/']}><ProtectedRoute><Sidebar /></ProtectedRoute></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
