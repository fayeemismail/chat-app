import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // if(!isAuthenticated){
  //   return <Navigate to='/sign-in' />
  // }

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;

  return children;
};

export default PrivateRoute;
