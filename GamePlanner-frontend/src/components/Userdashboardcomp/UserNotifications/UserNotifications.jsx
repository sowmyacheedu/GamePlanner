import React, { useState,useContext,useEffect } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import Cookies from "universal-cookie";

function Notifications(props){

    const notifications = props.notifications;
    const { user } = useAuth();
    const cookies = new Cookies();
    
    //   useEffect(() => {
    //     setNotifications(user?.notifications)
    //   }, {notifications});

   

    return (
    <div>
        {notifications.map(notification => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>       

    );
}
export default Notifications;