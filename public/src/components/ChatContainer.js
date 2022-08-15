import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import Logout from './Logout';
import axios from 'axios';
import { receiveMessageRoute } from '../utils/APIRoutes';
import { useNavigate } from 'react-router-dom';

export default function ChatContainer({ currentChat, socket }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState();
    const scrollRef = useRef();
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function receiveMsg() {
            try {
                const response = await axios.post(
                    receiveMessageRoute,
                    {
                        to: currentChat._id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setMessages(response.data);
            } catch (error) {
                if (error.response.status) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('chat-app-user');
                    navigate('/login');
                }
            }
        }
        receiveMsg();
    }, [currentChat]);

    useEffect(() => {
        socket.current.on('msg-receive', ({ message, from }) => {
            if (from === currentChat._id) {
                setArrivalMessage({ fromSelf: false, message });
            }
        });

        socket.current.on('disconnect', (reason) => {
            console.log(reason, 'this is err from chatContainer');
            if (reason === 'io server disconnect') {
                localStorage.removeItem('token');
                navigate('/login');
            }
        });
    }, [currentChat]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    const handleSendMsg = async (msg) => {
        socket.current.emit('send-msg', {
            to: currentChat._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        <img
                            src={
                                currentChat.avatarImage
                                    ? `data:image/svg+xml;base64,${currentChat.avatarImage}`
                                    : 'roomImage.jpg'
                            }
                            alt="chat"
                        />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username || currentChat.room}</h3>
                    </div>
                </div>
                <Logout socket={socket} />
            </div>
            <div className="chat-messages">
                {messages.map((message, i) => {
                    return (
                        <div ref={scrollRef} key={i}>
                            <div
                                className={`message ${
                                    message.fromSelf ? 'sended' : 'recieved'
                                }`}
                            >
                                <div className="content ">
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
    );
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 80% 10%;
    gap: 0.1rem;
    overflow: hidden;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-template-rows: 15% 70% 15%;
    }
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar {
                img {
                    height: 3rem;
                    border-radius: 50%;
                }
            }
            .username {
                h3 {
                    color: white;
                }
            }
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .message {
            display: flex;
            align-items: center;
            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #d1d1d1;
                @media screen and (min-width: 720px) and (max-width: 1080px) {
                    max-width: 70%;
                }
            }
        }
        .sended {
            justify-content: flex-end;
            .content {
                background-color: #4f04ff21;
            }
        }
        .recieved {
            justify-content: flex-start;
            .content {
                background-color: #9900ff20;
            }
        }
    }
`;
