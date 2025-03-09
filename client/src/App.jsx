import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Chat from "./pages/Chat"; // Make sure this file exists
import PrivateRoute from "./components/PrivateRoute"; // Your PrivateRoute component for authentication

const App = () => {
  return (
    <Routes>
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/sign-in" element={<SignIn />} />

      {/* Wrap Home route with PrivateRoute to ensure only authenticated users can access it */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      {/* ChatPage route */}
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default App;
