import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navigation } from '@/data/navigation'; // assuming this will be in a separate data file
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex">
      <nav className={cn('-sidebar', { 'sidebar-open': sidebarOpen })}> {/* Sidebar */}
        {navigation.map((item) => (
          <Link key={item.name} to={`/${item.href}`}>{item.name}</Link>
        ))}
        <Avatar onClick={logout}>{user?.name}</Avatar>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;