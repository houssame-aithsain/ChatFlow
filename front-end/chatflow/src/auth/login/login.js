async function Login(email, password ) {
  console.log(email, password);

  const loginAction = async () => {
    try {
      const credentials = { email, password };
      const response = await fetch("http://127.0.0.1:8443/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();
      console.log("API Response:", data);

      return data;
    } catch (err) {
      console.error(err);
    }
  };
  return await loginAction();
}

export default Login;