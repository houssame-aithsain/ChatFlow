import React, { useState } from 'react';

async function Login(email, password) {
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
          } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData);
        }
}

export default Login
