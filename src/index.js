import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthPage from './Pages/Authentication/AuthPage';
import SignupCard from './Components/SignUpCard';
import ForgotPasswordCard from './Components/ForgotPasswordCard';
import UpdatePasswordCard from './Components/UpdatePasswordCard';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgentLayout from './Pages/agent/AgentLayout';


import StudentLayout from './Pages/student/StudentLayout';


const root = ReactDOM.createRoot(document.getElementById('root'));



const App = () => {

 

  return (
    <React.StrictMode>
      <BrowserRouter>
        <>







          {/* Authentication */}
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<SignupCard />} />
            <Route path='/forgot-password' element={<ForgotPasswordCard />} />
            <Route path='/update-password' element={<UpdatePasswordCard />} />
          </Routes>


          <StudentLayout/>

          {/* <AgentLayout/> */}


        </>


      </BrowserRouter>
    </React.StrictMode>
  )
}

root.render(

  <App />
);


