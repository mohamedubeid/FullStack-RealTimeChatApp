import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import SetAvatar from './pages/SetAvatar';
import Protected from './components/Protected';
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* <Route path="/" exact element={<Chat />} /> */}

                <Route
                    path="/setAvatar"
                    element={
                        <Protected>
                            <SetAvatar />
                        </Protected>
                    }
                />

                <Route
                    path="/"
                    element={
                        <Protected>
                            <Chat />
                        </Protected>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
