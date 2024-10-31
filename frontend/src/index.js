// index.js or App.js
import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
 // I use the clientId of my Google OAuth app here, so you can get in, but you can replace it with your own clientId.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="324089135009-kkl9nnfpa6rs4sjnkjerjorra0p642b1.apps.googleusercontent.com">
   
      <App />
    
  </GoogleOAuthProvider>
);
