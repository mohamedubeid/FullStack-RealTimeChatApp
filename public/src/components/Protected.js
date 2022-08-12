import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
const Protected = ({ children }) => {
    // const [token, setToken] = useState();
    // useEffect(() => {
    //     setToken();
    // });
    const token = localStorage.getItem('token');
    const chatAppUser = JSON.parse(localStorage.getItem('chat-app-user'));

    if (!token || !chatAppUser) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
export default Protected;
