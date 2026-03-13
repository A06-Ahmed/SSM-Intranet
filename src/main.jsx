import React, { StrictMode, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './styles/global.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Loading from './components/Loading.jsx';

// main.jsx (snippet of what you already have)
const Root = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Loader shows here
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <Loading /> // This now renders your new HashLoader
  ) : (
    <StrictMode>
      <GoogleOAuthProvider clientId="1059562189442-o0l70kemdiurr2q3npfmdfpc39bkiui2.apps.googleusercontent.com">
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<Root />);