import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import Logout from './Logout';
import axios from 'axios';
import { getUserMessagesRoute, getRoomMessagesRoute } from '../utils/APIRoutes';
import { useNavigate } from 'react-router-dom';

export default function ChatContainer({ currentChat, socket }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState();
    const scrollRef = useRef();
    const token = localStorage.getItem('token');
    const chatAppUser = JSON.parse(localStorage.getItem('chat-app-user'));

    useEffect(() => {
        async function receiveMsg() {
            const getMessages = currentChat.roomId
                ? getRoomMessagesRoute
                : getUserMessagesRoute;
            try {
                const response = await axios.post(
                    getMessages,
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
        console.log(
            'this is currentChat in receive message userEffect',
            currentChat
        );
        socket.current.on(
            'msg-receive',
            ({ message, sender, senderUsername }) => {
                const current = JSON.parse(localStorage.getItem('currentChat'));
                console.log(
                    'from: ',
                    sender,
                    'message: ',
                    message,
                    ' currentChat._id: ',
                    current._id
                );
                if (sender === current._id) {
                    setArrivalMessage({
                        fromSelf: false,
                        message,
                        sender: senderUsername,
                    });
                }
            }
        );

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
        currentChat.roomId
            ? socket.current.emit('send-room-msg', {
                  to: currentChat._id,
                  message: msg,
                  room: currentChat.roomId.room,
                  sender: chatAppUser.username,
              })
            : socket.current.emit('send-msg', {
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
    const handleLeaveRoom = () => {
        console.log('leaveRoom');
    };
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
                        <h3>
                            {currentChat.username || currentChat.roomId.room}
                        </h3>
                    </div>
                </div>
                <button onClick={handleLeaveRoom}>Leave Room</button>
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
                                <span>
                                    {' '}
                                    {chatAppUser.username !== message?.sender &&
                                        message?.sender}
                                </span>
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
        button {
            padding: 10px;
            cursor: pointer;
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        color: white;
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
