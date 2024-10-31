// index.js or App.js
import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './authcontext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="324089135009-kkl9nnfpa6rs4sjnkjerjorra0p642b1.apps.googleusercontent.com">
   
      <App />
    
  </GoogleOAuthProvider>
);
