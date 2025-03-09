import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/sign-in" element={<SignIn />} />

      {/* Routes where Header should be shown */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<><Header /><Home /></>} />
        <Route path="/chat" element={<><Header /><Chat /></>} />
        <Route path="/profile" element={<><Header /><Profile /></>} />
      </Route>


    </Routes>
  );
};

export default App;
