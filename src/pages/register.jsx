import React, { useState, useEffect } from 'react';
import {
  Page,
  Button
} from 'framework7-react';
import logo from '../assets/images/logo.png'; // prilagodi putanju ako je drugačije


const Register = ({ f7router }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // useEffect(() => {
  //   document.body.classList.add('no-toolbar');
  //   return () => {
  //     document.body.classList.remove('no-toolbar');
  //   };
  // }, []);

  const handleRegister = () => {
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    f7router.navigate('/home/');
  };

  return (
    <Page name="register" className="login-custom-page no-navbar no-toolbar">
      {/* Inline CSS to hide toolbar */}
      <style>{`
        .toolbar.tabbar.toolbar-bottom.tabbar-icons.toolbar-transitioning{
        display:none !important;}
      `}</style>

      <div className="login-wrapper">
        <div className="login-top">
                  <img src={logo} alt="Logo" className="login-logo" />
                </div>

        <div className="login-container">
          <h2>Register</h2>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="login-input"
          />
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

          <Button fill large className="login-button" onClick={handleRegister}>
            Register
          </Button>

          <div className="login-footer">
            <span>Already have an account?</span>
            <a href="/login/" className="signup-link">Login</a>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Register;
