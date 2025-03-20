import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const ConnectionsPage = () => {
    const { id } = useParams(); // Get user ID from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "followers"; // Default to "followers"
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const currentUser = useSelector((state) => state.auth.user);
    const navigate = useNavigate()
    
    const [darkMode, setDarkMode] = useState(() => {
      return localStorage.getItem("darkMode") === "true" || false;
    });
    
    useEffect(() => {
      // Listen for changes to localStorage from other components
      const handleStorageChange = (e) => {
        if (e.key === "darkMode") {
          setDarkMode(e.newValue === "true");
        }
      };
    
      // Check periodically for changes (since storage event doesn't fire in same window)
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
    }, [darkMode]);
    
    // ✅ Separate useEffect for fetching connections based on `tab`
    useEffect(() => {
      const fetchConnections = async () => {
        try {
          const response = await fetch(`/api/users/connection?userId=${currentUser.id}`);
          const data = await response.json();
    
          // ✅ Always update both states, not just one
          setFollowers(data.followers);
          setFollowing(data.following);
        } catch (error) {
          console.error("Failed to fetch connections:", error);
        }
      };
    
      fetchConnections();
    }, [tab, currentUser.id]); // ✅ Runs when `tab` or `currentUser.id` changes
    
    // ✅ If you only want to debug `followers` updates
    useEffect(() => {
    //   console.log(followers);
    }, [followers]); // ✅ Log only when `followers` changes


    const handleUnFollow = async(userId) => {
        try {
            await axios.post('/api/users/unFollow', {
                targetUserId: userId,
                currentUserId: currentUser.id
            })
            setFollowing((prev) => prev.filter(user => user._id !== userId))
        } catch (error) {
            console.log(error)
        }
    }

    const followBack = async (userId) => {
        try {
            const response = await axios.post('/api/users/sendFollow', {
                targetUserId: userId,
                currentUserId: currentUser.id
            });
    
            if (response.data.success) {
                setFollowers((prev) => 
                    prev.map(user => 
                        user._id === userId ? { ...user, followStatus: response.data.message == "Follow request sent" ? "requested" : "followed" } : user
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    };
    

    

  // Define theme colors based on dark mode state
  const colors = {
    bg: darkMode ? '#1A1A1A' : '#F5F3EE',
    border: darkMode ? '#333333' : '#E2DFD6',
    text: darkMode ? '#E8E6E1' : '#1A1A1A',
    secondaryText: darkMode ? '#A9A295' : '#6D6459',
    accent: darkMode ? '#C9AD6A' : '#9B8759',
    inputBg: darkMode ? '#2A2A2A' : '#FCFAF6',
    dropdownBg: darkMode ? '#2A2A2A' : '#FCFAF6',
    hoverBg: darkMode ? '#333333' : '#F5F3EE',
    btnBg: darkMode ? '#3E3D39' : '#3E3D39',
    btnText: darkMode ? '#FCFAF6' : '#FCFAF6',
    btnHoverBg: darkMode ? '#2A2A28' : '#2A2A28',
    activeTab: darkMode ? '#C9AD6A' : '#9B8759',
    inactiveTab: darkMode ? '#2A2A2A' : '#FCFAF6',
    inactiveTabText: darkMode ? '#A9A295' : '#6D6459',
  };

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        minHeight: '100vh',
      }}
      className="font-serif py-12 px-6"
    >
      <div className="max-w-lg mx-auto">
        <h1
          className="text-4xl font-bold text-center mb-12 tracking-tight"
          style={{ color: colors.text }}
        >
          <span
            style={{
              borderBottom: `2px solid ${colors.accent}`,
              paddingBottom: '0.5rem',
            }}
          >
            Connections
          </span>
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSearchParams({ tab: "followers" })}
            className="px-6 py-3 text-xs uppercase tracking-wider font-medium rounded-sm transition-colors"
            style={{
              backgroundColor: tab === "followers" ? colors.activeTab : colors.inactiveTab,
              color: tab === "followers" ? colors.btnText : colors.inactiveTabText,
              borderColor: tab === "followers" ? colors.activeTab : colors.border,
              border: "1px solid"
            }}
          >
            Followers
          </button>
          <button
            onClick={() => setSearchParams({ tab: "following" })}
            className="px-6 py-3 text-xs uppercase tracking-wider font-medium rounded-sm transition-colors"
            style={{
              backgroundColor: tab === "following" ? colors.activeTab : colors.inactiveTab,
              color: tab === "following" ? colors.btnText : colors.inactiveTabText,
              borderColor: tab === "following" ? colors.activeTab : colors.border,
              border: "1px solid"
            }}
          >
            Following
          </button>
        </div>

        <div
          style={{
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
          className="border rounded-sm p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-xl font-medium tracking-wide"
              style={{ color: colors.text }}
            >
              {tab === "followers" ? "Followers" : "Following"}
            </h2>
            <span 
              className="px-3 py-1 rounded-full text-xs"
              style={{ 
                backgroundColor: colors.accent,
                color: colors.btnText
              }}
            >
              {tab === "followers" ? followers.length : following.length}
            </span>
          </div>

          {tab === "followers" ? (
           <ul className="divide-y" style={{ borderColor: colors.border }}>
           {followers.map((user) => {
             const isFollowing = following.some(f => f._id === user._id);
             
             return (
               <li
                 key={user._id}
                 className="py-4 flex justify-between items-center transition-colors px-2 hover:bg-opacity-20"
                 style={{ borderColor: colors.border }}
               >
                 <div className="flex items-center">
                   <div 
                     className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
                     style={{ backgroundColor: colors.accent }}
                   >
                     {user.name.charAt(0)}
                   </div>
                   <div>
                     <span style={{ color: colors.text }} className="font-medium">
                       {user.name}
                     </span>
                     <p style={{ color: colors.secondaryText }} className="text-xs">
                       {user.email}
                     </p>
                   </div>
                 </div>
         
                 {/* ✅ Dynamic button state */}
                 {isFollowing ? (
                   <button
                     style={{
                       borderColor: colors.accent,
                       backgroundColor: "transparent",
                       color: colors.accent,
                     }}
                     className="px-5 py-2 border text-xs uppercase tracking-wider font-medium rounded-sm transition-colors hover:bg-opacity-20"
                   >
                     Message
                   </button>
                 ) : (
                   <button
                     style={{
                       borderColor: colors.accent,
                       backgroundColor: "transparent",
                       color: colors.accent,
                     }}
                     className="px-5 py-2 border text-xs uppercase tracking-wider font-medium rounded-sm transition-colors hover:bg-opacity-20"
                     onClick={() => followBack(user._id)}
                   >
                     {user.followStatus === "requested" ? "Requested" : user.followStatus === "followed" ? "Message" : "Follow Back"}
                   </button>
                 )}
               </li>
             );
           })}
         </ul>
         
         
         
          ) : (
            <ul style={{ borderColor: colors.border }} className="divide-y">
                {following.map((user, index) => (
                    <li
                    key={user._id || index} // Prefer `_id` over index if available
                    className="py-4 flex justify-between items-center transition-colors px-2 hover:bg-opacity-20"
                    style={{ borderColor: colors.border }}
                    >
                    <div className="flex items-center">
                        <div 
                        className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
                        style={{ backgroundColor: colors.accent }}
                        >
                        {user.name.charAt(0)} {/* ✅ Show first letter of name */}
                        </div>
                        <div>
                        <span style={{ color: colors.text }} className="font-medium">
                            {user.name} {/* ✅ Display name instead of full object */}
                        </span>
                        <p style={{ color: colors.secondaryText }} className="text-xs">
                            {user.email} {/* ✅ Show user email if needed */}
                        </p>
                        </div>
                    </div>
                    <button
                        style={{
                        borderColor: colors.btnBg,
                        backgroundColor: colors.btnBg,
                        color: colors.btnText,
                        }}
                        className="px-5 py-2 border text-xs uppercase tracking-wider font-medium rounded-sm transition-colors hover:bg-opacity-20"
                        onClick={() => handleUnFollow(user._id)}
                    >
                        Unfollow
                    </button>
                    </li>
                ))}
            </ul>

          )}
          
          {((tab === "followers" && followers.length === 0) || 
            (tab === "following" && following.length === 0)) && (
            <div className="py-12 text-center">
              <p style={{ color: colors.secondaryText }} className="italic">
                {tab === "followers" ? "No followers yet" : "You are not following anyone"}
              </p>
              {tab === "following" && (
                <p style={{ color: colors.accent }} className="text-sm mt-2 cursor-pointer" onClick={() => navigate('/explore')} >
                  Discover users to follow
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;