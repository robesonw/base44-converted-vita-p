import React, { useEffect, useState } from 'react';
import apiFetch from '@/lib/api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await apiFetch.get('/api/notifications');
      setNotifications(response.data);
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      <button className="notification-bell">🔔</button>
      <div className="dropdown">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index}>{notification.message}</div>
          ))
        ) : (
          <div>No notifications</div>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;