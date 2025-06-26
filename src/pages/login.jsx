import React, { useState, useEffect } from 'react';
import {
  Page,
  Button
} from 'framework7-react';

import logo from '../assets/images/logo.png'; // prilagodi putanju ako je drugačije

const Login = ({ f7router }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

//   useEffect(() => {
//     document.body.classList.add('no-toolbar');
//     return () => {
//       document.body.classList.remove('no-toolbar');
//     };
//   }, []);

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    f7router.navigate('/home/');
  };

  return (
    <Page name="login" className="login-custom-page no-navbar no-toolbar">
     
      <div className="login-wrapper">
        <div className="login-top">
          <img src={logo} alt="Logo" className="login-logo" />
        </div>

        <div className="login-container">
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <Button fill large className="login-button" onClick={handleLogin}>
            Login
          </Button>

          <div className="login-footer">
            <span>Create an account?</span>
            <a href="/register/" className="signup-link">SignUp</a>
          </div>
        </div>
      </div>
    </Page>
  );
};


export default Login;
