import React, { useState } from 'react';
import { useRef } from 'react';
import Login from './login/login';
import Register from './register/register'
import { useHistory } from 'react-router-dom';

function Auth() {
	const history = useHistory();
	const containerRef = useRef(null);
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
	const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
	const [first_name, setFirstName] = useState('');
	const [last_name, setLastName] = useState('');
	const [username, setUserName] = useState('');

    const handleSignIn = () => {
        setIsRightPanelActive(false);
    };

	const handleSignUp = () => {
        setIsRightPanelActive(true);
    };

    return (
        <div ref={containerRef} className='login-section'>
            <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
            	<div className="form-container sign-up-container">
            		<form action="#">
            			<h1>Create Account</h1>
            			{/* <div className="social-container">
            				<a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            				<a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            				<a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            			</div> */}
            			{/* <span>or use your email for registration</span> */}
            			<input type="text" placeholder="First name"
							value={first_name}
							onChange={(e) => setFirstName(e.target.value)}
						/>
            			<input type="text" placeholder="Last name"
							value={last_name}
							onChange={(e) => setLastName(e.target.value)}
						/>
            			<input type="text" placeholder="Username"
							value={username}
							onChange={(e) => setUserName(e.target.value)}
						/>
            			<input type="email" placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
            			<input type="password" placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
            			<button onClick={(e) => {
							e.preventDefault();
							Register(email, password, first_name, last_name, username);
						}}>Sign Up</button>
            		</form>
            	</div>
            	<div className="form-container sign-in-container">
            		<form action="#">
            			<h1>Sign in</h1>
            			{/* <div className="social-container">
            				<a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            				<a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            				<a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            			</div> */}
            			{/* <span>or use your account</span> */}
            			<input type="email" placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
            			<input type="password" placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
            			<a href="#">Forgot your password?</a>
            			<button onClick={(e) =>{
							e.preventDefault();
							Login(email, password, history);
						}}>Sign In</button>
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
            				<p>Enter your personal details and start journey with us</p>
            				<button onClick={handleSignUp} className="ghost" id="signUp">Sign Up</button>
            			</div>
            		</div>
            	</div>
            </div>
        </div>
    );
}

export default Auth;
