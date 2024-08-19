import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isTokenValid, setIsTokenValid] = useState(false); // Default to false
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        const expiration = sessionStorage.getItem('tokenExpiration');
        const now = Date.now();

        if (expiration && now > parseInt(expiration)) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('tokenExpiration');
          setIsTokenValid(false);
          setNotification('Your session has expired. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 2000); // Redirect after 2 seconds to show the notification
        } else {
          setIsTokenValid(true);
        }
      } else {
        setIsTokenValid(false);
      }
    };

    checkTokenValidity();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenExpiration');
    setIsTokenValid(false);
    setNotification('You have been logged out.');
    setTimeout(() => {
      navigate('/login');
    }, 2000); // Redirect after 2 seconds to show the notification
  };

  return (
    <header className="bg-black text-white p-4  shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">MusicPlayer</Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-400">Home</Link>
            </li>
            <li>
              <Link to="/playlists" className="hover:text-blue-400">Playlist</Link>
            </li>
            <li>
              {isTokenValid ? (
                <button 
                  onClick={handleLogout} 
                  className="hover:text-blue-400 bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="hover:text-blue-400">Login</Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
      {/* Notification Section */}
      {notification && (
        <div className="fixed top-0 right-0 mt-4 mr-4 bg-red-500 text-white px-4 py-2 rounded">
          {notification}
        </div>
      )}
    </header>
  );
};

export default Header;
