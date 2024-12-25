import React, { useState } from 'react';
import { useRef } from 'react';

function LoginPage() {
    const containerRef = useRef(null);
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const HandleSumition = async (event) => {
        event.preventDefault();
        const credentials = {email, password};
        console.log(credentials);
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
            console.error('Login failed:', errorData);
        }
    };

    const handleSignUp = () => {
        setIsRightPanelActive(true);
    };

    const handleSignIn = () => {
        setIsRightPanelActive(false);
    };

    return (
        <div ref={containerRef} className='login-section'>
            <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
            	<div className="form-container sign-up-container">
            		<form action="#">
            			<h1>Create Account</h1>
            			<div className="social-container">
            				<a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            				<a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            				<a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            			</div>
            			<span>or use your email for registration</span>
            			<input type="text" placeholder="Name" />
            			<input type="email" placeholder="Email" />
            			<input type="password" placeholder="Password" />
            			<button>Sign Up</button>
            		</form>
            	</div>
            	<div className="form-container sign-in-container">
            		<form action="#">
            			<h1>Sign in</h1>
            			<div className="social-container">
            				<a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            				<a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            				<a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            			</div>
            			<span>or use your account</span>
            			<input type="email" placeholder="Email" />
            			<input type="password" placeholder="Password" />
            			<a href="#">Forgot your password?</a>
            			<button>Sign In</button>
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

export default LoginPage;
