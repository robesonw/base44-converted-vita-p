import React from 'react';
import { Link } from 'react-router-dom';

const Layout = () => {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/analytics">Analytics</Link>
      {/* More Links */}
    </nav>
  );
};

export default Layout;