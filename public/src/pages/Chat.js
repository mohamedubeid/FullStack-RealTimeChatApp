import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host, getUserRooms } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';

function Chat() {
    const socket = useRef();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const chatAppUser = JSON.parse(localStorage.getItem('chat-app-user'));

    const [contacts, setContacts] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [currentChat, setCurrentChat] = useState();

    useEffect(() => {
        if (!chatAppUser.isAvatarImageSet) {
            return navigate('/setAvatar');
        }
    }, []);
    useEffect(() => {
        async function getContacts() {
            try {
                const data = await axios.get(`${allUsersRoute}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setContacts(data.data);
            } catch (error) {
                if (error.response.status) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('chat-app-user');
                    navigate('/login');
                }
            }
        }

        async function getRooms() {
            try {
                const data = await axios.get(`${getUserRooms}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRooms(data.data);
            } catch (error) {
                if (error.response.status) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('chat-app-user');
                    navigate('/login');
                }
            }
        }
        getRooms();
        getContacts();
    }, []);
    useEffect(() => {
        socket.current = io(host, { autoConnect: false });
        socket.current.auth = { token };
        socket.current.connect();
        socket.current.emit('test');
    }, []);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <Container>
            <div className="container">
                <Contacts
                    contacts={contacts}
                    rooms={rooms}
                    chatAppUser={chatAppUser}
                    changeChat={handleChatChange}
                />
                {currentChat ? (
                    <ChatContainer currentChat={currentChat} socket={socket} />
                ) : (
                    <Welcome />
                )}
            </div>
        </Container>
    );
}

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .container {
        height: 85vh;
        width: 85vw;
        background-color: #00000076;
        display: grid;
        grid-template-columns: 25% 75%;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
        }
    }
`;

export default Chat;
