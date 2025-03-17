import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Extract styles into a reusable function
const useStyles = (darkMode) => {
  return {
    container: `min-h-screen font-serif py-12 px-6 ${darkMode ? 'bg-[#1A1A1A] text-[#E8E6E1]' : 'bg-[#F5F3EE] text-[#1A1A1A]'}`,
    title: `text-3xl font-bold text-center mb-10 tracking-tight`,
    titleBorder: `border-b-2 pb-2 ${darkMode ? 'border-[#C9AD6A]' : 'border-[#9B8759]'}`,
    formContainer: `rounded-sm shadow-sm p-6 ${darkMode ? 'bg-[#2A2A2A] border border-[#333333]' : 'bg-[#FCFAF6] border border-[#E2DFD6]'}`,
    input: `w-full p-2 ${darkMode ? 'bg-[#333333] border border-[#444444] text-[#E8E6E1] focus:border-[#C9AD6A]' : 'bg-[#F9F7F2] border border-[#E2DFD6] text-[#1A1A1A] focus:border-[#9B8759]'}`,
    label: `block text-sm uppercase tracking-wider mb-2 ${darkMode ? 'text-[#A9A295]' : 'text-[#6D6459]'}`,
    toggleWrapper: `flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors`,
    toggleDot: `w-4 h-4 rounded-full transform transition-transform bg-white`,
    profileFrameOuter: `w-24 h-24 absolute rounded-full transform rotate-3 ${darkMode ? 'border border-[#C9AD6A]' : 'border border-[#9B8759]'}`,
    profileFrameInner: `w-24 h-24 rounded-full flex items-center justify-center text-2xl font-medium relative z-10 overflow-hidden ${darkMode ? 'bg-[#2A2A2A] border-2 border-[#C9AD6A]' : 'bg-[#F5F3EE] border-2 border-[#9B8759]'}`,
    profileInitial: darkMode ? 'text-[#C9AD6A]' : 'text-[#9B8759]',
    uploadButton: `cursor-pointer px-4 py-2 text-xs uppercase tracking-wider ${darkMode ? 'bg-[#333333] text-[#A9A295] hover:bg-[#444444]' : 'bg-[#F9F7F2] text-[#6D6459] hover:bg-[#F5F3EE]'}`,
    toggleText: `text-sm uppercase tracking-wider ${darkMode ? 'text-[#A9A295]' : 'text-[#6D6459]'}`,
    toggleActive: darkMode ? 'bg-[#C9AD6A]' : 'bg-[#9B8759]',
    toggleInactive: darkMode ? 'bg-[#444444]' : 'bg-[#E2DFD6]',
    submitButton: `px-6 py-2 text-xs uppercase tracking-wider font-medium transition-colors bg-[#3E3D39] text-[#FCFAF6] hover:bg-[#2A2A28] w-full`
  };
};

const EditProfile = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: '', bio: '', isPrivate: false });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true' || false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Get styles based on dark mode
  const styles = useStyles(darkMode);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/findSpecificUser?userId=${currentUser.id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    const handleStorageChange = (e) => {
      if (e.key === 'darkMode') {
        setDarkMode(e.newValue === 'true');
      }
    };

    const checkDarkMode = () => {
      const currentSetting = localStorage.getItem('darkMode') === 'true';
      if (currentSetting !== darkMode) {
        setDarkMode(currentSetting);
      }
    };

    const intervalId = setInterval(checkDarkMode, 100);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [currentUser.id, darkMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      user.name === currentUser.name &&
      user.bio === currentUser.bio &&
      user.isPrivate === currentUser.isPrivate &&
      !profilePicture &&
      !showPasswordFields
    ) {
      toast.info('Nothing changed');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('userId', currentUser.id);
    formDataToSend.append('name', user.name);
    formDataToSend.append('bio', user.bio);
    formDataToSend.append('isPrivate', user.isPrivate);

    if (showPasswordFields) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      formDataToSend.append('password', formData.password);
    }

    if (profilePicture) {
      formDataToSend.append('profilePicture', profilePicture);
    }

    try {
      const response = await axios.put('/api/users/update-profile', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Profile updated successfully');
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        toast.error(response.data.error || 'Error updating profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  // Render component with extracted styles
  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className="max-w-sm mx-auto">
        <h1 className={styles.title}>
          <span className={styles.titleBorder}>Edit Profile</span>
        </h1>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className={styles.profileFrameOuter}></div>
                <div className={styles.profileFrameInner}>
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className={styles.profileInitial}>
                      {(user.name && user.name.charAt(0)) || 'U'}
                    </span>
                  )}
                </div>
              </div>

              <label className={styles.uploadButton}>
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            {/* Name Input */}
            <div>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            {/* Bio Input */}
            <div>
              <label className={styles.label}>Bio</label>
              <textarea
                name="bio"
                value={user.bio}
                onChange={handleInputChange}
                rows="3"
                className={styles.input}
              ></textarea>
            </div>

            {/* Change Password Checkbox */}
            <div className="flex items-center justify-between">
              <label className={styles.toggleText}>Change Password</label>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showPasswordFields}
                  onChange={() => setShowPasswordFields((prev) => !prev)}
                  className="sr-only"
                  id="toggle-password"
                />
                <label
                  htmlFor="toggle-password"
                  className={`${styles.toggleWrapper} ${showPasswordFields ? styles.toggleActive : styles.toggleInactive}`}
                >
                  <span className={`${styles.toggleDot} ${showPasswordFields ? 'translate-x-7' : 'translate-x-1'}`} />
                </label>
              </div>
            </div>

            {/* Password Fields - Only shown when checkbox is checked */}
            {showPasswordFields && (
              <>
                <div>
                  <label className={styles.label}>New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    required={showPasswordFields}
                  />
                </div>
                <div>
                  <label className={styles.label}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    required={showPasswordFields}
                  />
                </div>
              </>
            )}

            {/* Private Account Toggle */}
            <div className="flex items-center justify-between">
              <label className={styles.toggleText}>Private Account</label>
              <div className="relative">
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={user.isPrivate}
                  onChange={handleInputChange}
                  className="sr-only"
                  id="toggle-private"
                />
                <label
                  htmlFor="toggle-private"
                  className={`${styles.toggleWrapper} ${user.isPrivate ? styles.toggleActive : styles.toggleInactive}`}
                >
                  <span className={`${styles.toggleDot} ${user.isPrivate ? 'translate-x-7' : 'translate-x-1'}`} />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button type="submit" className={styles.submitButton}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;