import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, useUser } from '../../auth/AuthProvider';


const Profile = () => {
  const user = useUser();
  console.log('User:', user);
  const { logout } = useAuth();
  const history = useHistory();
  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    console.log('Logging out...');
    const Logout = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8443/api/users/logout/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Logout:', data);
          logout();
          window.location.reload();
          history.push('/login');
        } else {
          const errorData = await response.json();
          console.error('Logout failed:', errorData);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    Logout();
  };

  return (
    <div className="p-4 border-t border-gray-700/50" ref={profileRef}>
      <div 
        className={`relative flex items-center space-x-3 p-2 rounded-lg 
          ${showLogout ? 'bg-gradient-to-r from-[#FF4B2B]/10 to-[#FF416C]/10' : ''}
          hover:bg-gradient-to-r hover:from-[#FF4B2B]/10 hover:to-[#FF416C]/10 
          cursor-pointer transition-all duration-300`}
        onClick={handleProfileClick}
      >
        {/* Profile Picture with Status Indicator */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] flex items-center justify-center
            transform transition-transform duration-300 hover:scale-105">
            <span className="text-white font-medium">{user.first_name[0] + user.last_name[0]}</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-gray-900"></div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h3 className="text-sm font-medium">{user.first_name}</h3>
        </div>

        {/* Logout Button with Animation */}
        <div className={`transition-all duration-300 ${showLogout ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button 
            onClick={handleLogout}
            className="group relative p-2 hover:bg-gradient-to-r hover:from-[#FF4B2B] hover:to-[#FF416C] rounded-lg transition-all duration-300"
          >
            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
              bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 
              group-hover:opacity-100 transition-opacity duration-300">
              Logout
            </span>

            {/* Logout Icon */}
            <svg 
              className="w-5 h-5 transform transition-transform duration-300 group-hover:scale-110" 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 18 16"
            >
              <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                className="group-hover:stroke-white"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;