import React, { useState, useRef } from 'react';
import { useAuth } from './AuthProvider'; // Import the custom hook
import Login from './login/login';
import Register from './register/register';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Auth() {
	const history = useHistory();
    const containerRef = useRef(null);
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [username, setUserName] = useState('');
    
    const { login } = useAuth();

    const SignIn = async (email, password) => {
        const loginResponse = await Login(email, password);
        if (loginResponse.token) {
            login(loginResponse.user, loginResponse.token);
			history.push('/home');
			window.location.reload();
        }
    };

    const handleSignUp = () => {
        setIsRightPanelActive(true);
    };

	const handleSignIn = () => {
        setIsRightPanelActive(false);
    };

    return (
        <div ref={containerRef} className="login-section">
            <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
                <div className="form-container sign-up-container">
                    <form action="#">
                        <h1>Create Account</h1>
                        {/* Registration Form */}
                        <input type="text" placeholder="First name" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                        <input type="text" placeholder="Last name" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUserName(e.target.value)} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button onClick={(e) => { e.preventDefault(); Register(email, password, first_name, last_name, username, setIsRightPanelActive); setIsRightPanelActive(true)}}>
                            Sign Up
                        </button>
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form action="#">
                        <h1>Sign in</h1>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <a href="#">Forgot your password?</a>
                        <button onClick={(e) => { e.preventDefault(); SignIn(email, password); }}>
                            Sign In
                        </button>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button onClick={handleSignIn} className="ghost" id="signIn">Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start your journey with us</p>
                            <button onClick={handleSignUp} className="ghost" id="signUp">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
