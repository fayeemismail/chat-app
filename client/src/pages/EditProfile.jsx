import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
    const currentUser = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState({
      userId: "", // Initially empty, will be set in useEffect
      name: "",
      bio: "",
      password: "",
      confirmPassword: "",
      profilePicture: null,
      isPrivate: false,
    });
  
    const [previewImage, setPreviewImage] = useState(null);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [darkMode, setDarkMode] = useState(() =>
      localStorage.getItem("darkMode") === "true"
    );
  
    useEffect(() => {
      if (currentUser) {
        setFormData((prevState) => ({
          ...prevState,
          userId: currentUser.id, // ✅ Set userId only when currentUser is available
          name: currentUser.name || "",
          bio: currentUser.bio || "",
          isPrivate: currentUser.isPrivate || false,
        }));
  
        if (currentUser.profilePicture) {
          setPreviewImage(currentUser.profilePicture);
        }
      }
  
      // Listen for dark mode changes in localStorage
      const handleStorageChange = (e) => {
        if (e.key === "darkMode") {
          setDarkMode(e.newValue === "true");
        }
      };
  
      const checkDarkMode = () => {
        const currentSetting = localStorage.getItem("darkMode") === "true";
        if (currentSetting !== darkMode) {
          setDarkMode(currentSetting);
        }
      };
  
      const intervalId = setInterval(checkDarkMode, 500);
      window.addEventListener("storage", handleStorageChange);
  
      return () => {
        window.removeEventListener("storage", handleStorageChange);
        clearInterval(intervalId);
      };
    }, [currentUser]);
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setPreviewImage(URL.createObjectURL(file));
        setFormData((prevState) => ({
          ...prevState,
          profilePicture: file,
        }));
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!formData.userId) {
        toast.error("User ID is missing!", { theme: darkMode ? "dark" : "light" });
        return;
      }
  
      if (showPasswordFields && formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match", { theme: darkMode ? "dark" : "light" });
        return;
      }
  
      // Check if anything has changed
      const hasChanged =
        (formData.name && formData.name !== (currentUser.name || "")) ||
        (formData.bio && formData.bio !== (currentUser.bio || "")) ||
        formData.isPrivate !== (currentUser.isPrivate || false) ||
        (showPasswordFields && formData.password.trim() !== "") ||
        (formData.profilePicture instanceof File);
  
      if (!hasChanged) {
        toast.success("Nothing changed!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: darkMode ? "dark" : "light",
        });
        return;
      }
  
      const formDataToSend = new FormData();
      formDataToSend.append("userId", formData.userId); // ✅ Ensure userId is included
  
      if (formData.name.trim() !== "") {
        formDataToSend.append("name", formData.name);
      }
      if (formData.bio.trim() !== "") {
        formDataToSend.append("bio", formData.bio);
      }
      if (showPasswordFields && formData.password.trim() !== "") {
        formDataToSend.append("password", formData.password);
      }
      formDataToSend.append("isPrivate", formData.isPrivate);
  
      if (formData.profilePicture instanceof File) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }
  
      try {
        console.log("Sending data:", formDataToSend);
        const response = await fetch(`/api/users/update-profile`, {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${currentUser?.token || ""}`,
          },
        });
  
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
        const data = await response.json();
  
        if (data.success) {
          toast.success("Profile updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: darkMode ? "dark" : "light",
          });
          setTimeout(() => navigate("/profile"), 3000);
        } else {
          toast.error(data.message || "Failed to update profile", { theme: darkMode ? "dark" : "light" });
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("An error occurred. Please try again.", { theme: darkMode ? "dark" : "light" });
      }
    };
  


  return (
    <div className={`min-h-screen font-serif py-12 px-6 ${
      darkMode ? 'bg-[#1A1A1A] text-[#E8E6E1]' : 'bg-[#F5F3EE] text-[#1A1A1A]'
    }`}>
      <ToastContainer />
      <div className="max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 tracking-tight">
          <span className={`border-b-2 pb-2 ${
            darkMode ? 'border-[#C9AD6A]' : 'border-[#9B8759]'
          }`}>Edit Profile</span>
        </h1>
        
        <div className={`rounded-sm shadow-sm p-6 ${
          darkMode ? 'bg-[#2A2A2A] border border-[#333333]' : 'bg-[#FCFAF6] border border-[#E2DFD6]'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className={`w-24 h-24 absolute rounded-full transform rotate-3 ${
                  darkMode ? 'border border-[#C9AD6A]' : 'border border-[#9B8759]'
                }`}></div>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-medium relative z-10 overflow-hidden ${
                  darkMode 
                    ? 'bg-[#2A2A2A] border-2 border-[#C9AD6A]' 
                    : 'bg-[#F5F3EE] border-2 border-[#9B8759]'
                }`}>
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className={darkMode ? 'text-[#C9AD6A]' : 'text-[#9B8759]'}>
                      {(formData.name && formData.name.charAt(0)) || "U"}
                    </span>
                  )}
                </div>
              </div>
              
              <label className={`cursor-pointer px-4 py-2 text-xs uppercase tracking-wider ${
                darkMode ? 'bg-[#333333] text-[#A9A295] hover:bg-[#444444]' : 'bg-[#F9F7F2] text-[#6D6459] hover:bg-[#F5F3EE]'
              }`}>
                Upload Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </label>
            </div>
            
            {/* Name Input */}
            <div>
              <label className={`block text-sm uppercase tracking-wider mb-2 ${
                darkMode ? 'text-[#A9A295]' : 'text-[#6D6459]'
              }`}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className={`w-full p-2 ${
                  darkMode 
                    ? 'bg-[#333333] border border-[#444444] text-[#E8E6E1] focus:border-[#C9AD6A]' 
                    : 'bg-[#F9F7F2] border border-[#E2DFD6] text-[#1A1A1A] focus:border-[#9B8759]'
                }`}
                required
              />
            </div>
            
            {/* Bio Input */}
            <div>
              <label className={`block text-sm uppercase tracking-wider mb-2 ${
                darkMode ? 'text-[#A9A295]' : 'text-[#6D6459]'
              }`}>
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                rows="3"
                className={`w-full p-2 ${
                  darkMode 
                    ? 'bg-[#333333] border border-[#444444] text-[#E8E6E1] focus:border-[#C9AD6A]' 
                    : 'bg-[#F9F7F2] border border-[#E2DFD6] text-[#1A1A1A] focus:border-[#9B8759]'
                }`}
              ></textarea>
            </div>
            
            {/* Change Password Checkbox */}
            <div className="flex items-center justify-between">
              <label className={`text-sm uppercase tracking-wider ${
                darkMode ? 'text-[#A9A295]' : 'text-[#6D6459]'
              }`}>
                Change Password
              </label>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showPasswordFields}
                  onChange={() => {
                    setShowPasswordFields(!showPasswordFields);
                    if (!showPasswordFields) {
                      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
                    }
                  }}
                  className="sr-only"
                  id="toggle-password"
                />
                <label 
                  htmlFor="toggle-password"
                  className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    showPasswordFields 
                      ? (darkMode ? 'bg-[#C9AD6A]' : 'bg-[#9B8759]') 
                      : (darkMode ? 'bg-[#444444]' : 'bg-[#E2DFD6]')
                  }`}
                >
                  <span 
                    className={`w-4 h-4 rounded-full transform transition-transform bg-white ${
                      showPasswordFields ? 'translate-x-7' : 'translate-x-1'
                    }`} 
                  />
                </label>
              </div>
            </div>
            
            {/* Password Fields - Only shown when checkbox is checked */}
            {showPasswordFields && (
              <>
                {/* New Password Input */}
                <div>
                  <label className={`block text-sm uppercase tracking-wider mb-2 ${
                    darkMode ? 'text-[#A9A295]' : 'text-[#6D6459]'
                  }`}>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className={`w-full p-2 ${
                      darkMode 
                        ? 'bg-[#333333] border border-[#444444] text-[#E8E6E1] focus:border-[#C9AD6A]' 
                        : 'bg-[#F9F7F2] border border-[#E2DFD6] text-[#1A1A1A] focus:border-[#9B8759]'
                    }`}
                    required={showPasswordFields}
                  />
                </div>
                
                {/* Confirm Password Input */}
                <div>
                  <label className={`block text-sm uppercase tracking-wider mb-2 ${
                    darkMode ? 'text-[#A9A295]' : 'text-[#6D6459]'
                  }`}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword || ""}
                    onChange={handleChange}
                    className={`w-full p-2 ${
                      darkMode 
                        ? 'bg-[#333333] border border-[#444444] text-[#E8E6E1] focus:border-[#C9AD6A]' 
                        : 'bg-[#F9F7F2] border border-[#E2DFD6] text-[#1A1A1A] focus:border-[#9B8759]'
                    }`}
                    required={showPasswordFields}
                  />
                </div>
              </>
            )}
            
            {/* Private Account Toggle */}
            <div className="flex items-center justify-between">
              <label className={`text-sm uppercase tracking-wider ${
                darkMode ? 'text-[#A9A295]' : 'text-[#6D6459]'
              }`}>
                Private Account
              </label>
              <div className="relative">
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate || false}
                  onChange={handleChange}
                  className="sr-only"
                  id="toggle-private"
                />
                <label 
                  htmlFor="toggle-private"
                  className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${
                    formData.isPrivate 
                      ? (darkMode ? 'bg-[#C9AD6A]' : 'bg-[#9B8759]') 
                      : (darkMode ? 'bg-[#444444]' : 'bg-[#E2DFD6]')
                  }`}
                >
                  <span 
                    className={`w-4 h-4 rounded-full transform transition-transform bg-white ${
                      formData.isPrivate ? 'translate-x-7' : 'translate-x-1'
                    }`} 
                  />
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className={`px-6 py-2 text-xs uppercase tracking-wider font-medium transition-colors 
                  bg-[#3E3D39] text-[#FCFAF6] hover:bg-[#2A2A28] w-full`}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;