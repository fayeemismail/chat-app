import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ExeEditProfile = () => {
  const fileInputRef = useRef(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const currentUser = useSelector((state) => state.auth.user)
  const [isPrivate, setIsPrivate] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [user, setUser] = useState({ name: '', bio: '', isPrivate: false })
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/users/findSpecificUser?userId=${currentUser.id}`);
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData()
  }, [currentUser.id])
  console.log(user)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData, 'Private account:', isPrivate, 'Profile Image:', profileImage);
    // In a real app, you would upload the image to a server here
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Profile Picture Upload */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <button 
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <p className="text-sm text-blue-600 cursor-pointer hover:text-blue-800" onClick={triggerFileInput}>
            Upload new photo
          </p>
        </div>
        
        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Bio Input */}
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={user.bio}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Change Password Switch */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Change Password</span>
          <div 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showPasswordFields ? 'bg-blue-600' : 'bg-gray-200'}`}
            onClick={() => setShowPasswordFields(!showPasswordFields)}
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPasswordFields ? 'translate-x-6' : 'translate-x-1'}`} 
            />
          </div>
        </div>
        
        {/* Password Fields (Conditional) */}
        {showPasswordFields && (
          <div className="mb-6 space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
        
        {/* Private Account Switch */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Private Account</span>
          <div 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPrivate ? 'bg-blue-600' : 'bg-gray-200'}`}
            onClick={() => setIsPrivate(!isPrivate)}
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-1'}`} 
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ExeEditProfile;