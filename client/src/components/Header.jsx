import React from "react";
import { FaSearch, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const homePage = ()=>{
        navigate('/')
    }

    const handlLogout = async() =>{
        await dispatch(logout())
        navigate('/sign-in')
    }

    const handleProfile = ()=>{
        navigate('/profile')
    }

  return (
    <header className="flex items-center justify-between bg-gray-900 text-white p-4 z-50 shadow-md">
      {/* App Name */}
      <h1 className="text-xl font-bold" onClick={homePage}>Blah Blah</h1>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-800 px-3 py-1 rounded-md">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none text-white placeholder-gray-400"
        />
      </div>

      {/* Profile & Logout */}
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-2xl cursor-pointer" onClick={handleProfile} />
        <button className="flex items-center bg-red-600 px-3 py-1 rounded-md hover:bg-red-700" onClick={handlLogout}>
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
