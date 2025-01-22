import React, { useState, useRef } from 'react';
  import { ArrowRight, Mail, Lock, User, UserCircle } from 'lucide-react';
  import { useAuth } from './AuthProvider';
  import Login from './login/login';
  import Register from './register/register';
  import { useHistory } from 'react-router-dom';
  import { NotificationSystem } from '../Home/NotificationSystem';
  
  function App() {
    const history = useHistory();
    const containerRef = useRef(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [notifications, setNotifications] = useState([]);
  
    const { login } = useAuth();
  
    const SignIn = async (email, password) => {
      const loginResponse = await Login(email, password);
      if (loginResponse.token) {
        login(loginResponse.user, loginResponse.token);
        history.push('/home');
        window.location.reload();
      } else {
        NotificationSystem("Invalid email or password!", "error", setNotifications);
      }
    };
  
    const handleSignUp = () => {
      setIsSignUp(true);
    };
  
    const handleSignIn = () => {
      setIsSignUp(false);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel - Image and Welcome Text */}
          <div className="md:w-1/2 bg-red-600 p-12 text-white flex flex-col justify-center items-center text-center">
            <img
              src="https://images.unsplash.com/photo-1579451861283-a2239070aaa9?auto=format&fit=crop&q=80&w=1000"
              alt="Authentication"
              className="w-64 h-64 object-cover rounded-full mb-8 border-4 border-white/20"
            />
            <h2 className="text-3xl font-bold mb-4">
              {isSignUp ? 'Welcome Back!' : 'Hello, Friend!'}
            </h2>
            <p className="mb-8 text-red-100">
              {isSignUp
                ? 'Already have an account? Sign in to continue your journey with us.'
                : 'Start your journey with us today. Create your account and explore more.'}
            </p>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="px-8 py-3 border-2 border-white rounded-full text-white hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center gap-2"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
              <ArrowRight size={20} />
            </button>
          </div>
  
          {/* Right Panel - Form */}
          <div className="md:w-1/2 p-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
  
            <form className="space-y-4">
              {isSignUp && (
                <>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <User className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div className="relative flex-1">
                      <User className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
  
              {!isSignUp && (
                <div className="text-right">
                  <a href="#" className="text-sm text-red-600 hover:text-red-800">
                    Forgot your password?
                  </a>
                </div>
              )}
  
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (isSignUp) {
                    Register(email, password, firstName, lastName, username, setIsSignUp, setNotifications);
                  } else {
                    SignIn(email, password);
                  }
                }}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight size={20} />
              </button>
            </form>
  
            {/* Notification System */}
            <div className="fixed top-4 right-4 flex flex-col gap-4 z-50">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-2 text-sm rounded shadow cursor-pointer
                    ${notification.type === "success"
                      ? "bg-green-500 text-white"
                      : notification.type === "error"
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                    }
                    animate-fade-in-down
                  `}
                >
                  {notification.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default App;
