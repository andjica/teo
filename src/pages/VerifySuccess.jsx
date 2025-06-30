import { Link, Page, f7 } from 'framework7-react';
import { useEffect } from 'react';
import LogoImage from '../assets/images/logo.png';
import '../css/app.less';

const VerifySuccess = ({ f7router }) => {
  const email = new URLSearchParams(window.location.search).get('email');
  console.log("EMAIL SUCCESS");


  return (
    <Page name="verify-success" className="verify-email-page">
      <div className="login-top">
        <img className="login-logo" alt="logo" src={LogoImage} />
      </div>
      <div className="verify-email-container">
        <h1>Email Successfully Verified 🎉</h1>
        <p className="text-gray-700 text-sm mb-4">
          Your email: <span className="font-medium text-black">{email}</span>
        </p>
        <p>You can now log in to your account and start using the app.</p>
        <Link href="/login/" className="button button-fill login-button">
          Login
        </Link>
      </div>
    </Page>
  );
};

export default VerifySuccess;
