import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthPage from './Pages/Authentication/AuthPage';
import SignupCard from './Components/SignUpCard';
import ForgotPasswordCard from './Components/ForgotPasswordCard';
import UpdatePasswordCard from './Components/UpdatePasswordCard';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<SignupCard />} />
        <Route path='/forgot-password' element={<ForgotPasswordCard />} />
        <Route path='/update-password' element={<UpdatePasswordCard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


