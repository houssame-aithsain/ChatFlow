import React, {useState} from "react";

async function Register(email, password, first_name, last_name, username) {
    const credentails = {email, password, first_name, last_name, username};
    console.log(credentails);

    const response = await fetch('http://127.0.0.1:8443/api/users/register/',
        {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentails),
        }
    );

    if (response.ok) {
        const data = await response.json();
        console.log('registeration successful:', data);
      } else {
        const errorData = await response.json();
        console.error('registeration failed:', errorData);
    }
}

export default Register
