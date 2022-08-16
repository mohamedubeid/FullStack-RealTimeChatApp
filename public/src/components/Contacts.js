import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import axios from 'axios';
import { joinRoom } from '../utils/APIRoutes';

export default function Contacts({ contacts, rooms, chatAppUser, changeChat }) {
    const [currentSelected, setCurrentSelected] = useState();
    const [roomList, setRoomList] = useState([]);
    useEffect(() => {
        setRoomList(rooms);
    }, [rooms]);

    const [room, setRoom] = useState('');
    const token = localStorage.getItem('token');

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };
    const handleChange = (event) => {
        event.preventDefault();
        setRoom(event.target.value);
    };
    const handleSubmit = async () => {
        try {
            await axios.post(
                joinRoom,
                {
                    room,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setRoom('');
        } catch (error) {
            console.log(error);
        }
        const newRoomList = [...rooms, { roomId: { room: room } }];
        setRoomList(newRoomList);
    };
    return (
        <>
            {chatAppUser?.avatarImage && chatAppUser.username && (
                <Container>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h3>snappy</h3>
                    </div>
                    <div className="contacts">
                        <div className="input">
                            <input
                                value={room}
                                type="text"
                                placeholder="Enter Room Name"
                                name="room"
                                onChange={(e) => handleChange(e)}
                                min="3"
                                className="enter_group"
                            />
                            <button onClick={() => handleSubmit()}>
                                Join Room
                            </button>
                        </div>
                        {contacts.map((contact, index) => {
                            return (
                                <div
                                    className={`contact ${
                                        index === currentSelected
                                            ? 'selected'
                                            : ''
                                    }`}
                                    key={index}
                                    onClick={() =>
                                        changeCurrentChat(index, contact)
                                    }
                                >
                                    <div className="avatar">
                                        <img
                                            src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="username">
                                        <h3>{contact.username}</h3>
                                    </div>
                                </div>
                            );
                        })}
                        {roomList.map((room, index) => {
                            return (
                                <div
                                    className={`contact ${
                                        index + contacts.length ===
                                        currentSelected
                                            ? 'selected'
                                            : ''
                                    }`}
                                    key={index + contacts.length}
                                    onClick={() =>
                                        changeCurrentChat(
                                            index + contacts.length,
                                            { ...room, _id: room.roomId._id }
                                        )
                                    }
                                >
                                    <div className="avatar">
                                        <img
                                            src={`roomImage.jpg`}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="username">
                                        <h3>{room.roomId.room}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="current-user">
                        <div className="avatar">
                            <img
                                src={`data:image/svg+xml;base64,${chatAppUser.avatarImage}`}
                                alt="avatar"
                            />
                        </div>
                        <div className="username">
                            <h2>{chatAppUser.username}</h2>
                        </div>
                    </div>
                </Container>
            )}
        </>
    );
}
const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: hidden;
    background-color: #080420;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 2rem;
        }
        h3 {
            color: white;
            text-transform: uppercase;
        }
    }
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact {
            background-color: #ffffff34;
            min-height: 5rem;
            cursor: pointer;
            width: 90%;
            border-radius: 0.2rem;
            padding: 0.4rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            transition: 0.5s ease-in-out;
            .avatar {
                img {
                    height: 3rem;
                }
            }
            .username {
                h3 {
                    color: white;
                }
            }
        }
        .input {
            .enter_group {
                background-color: transparent;
                padding: 1rem;
                border: 0.1rem solid #4e0eff;
                border-radius: 0.4rem;
                color: white;
                width: 100%;
                font-size: 1rem;
                &:focus {
                    border: 0.1rem solid #997af0;
                    outline: none;
                }
            }
            button {
                background-color: #4e0eff;
                color: white;
                padding: 1rem 2rem;
                border: none;
                font-weight: bold;
                cursor: pointer;
                border-radius: 0.4rem;
                font-size: 0.8rem;
                text-transform: uppercase;
                &:hover {
                    background-color: #4e0eff;
                }
            }
        }
        .selected {
            background-color: #9a86f3;
        }
    }
    .current-user {
        background-color: #0d0d30;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        .avatar {
            img {
                height: 4rem;
                max-inline-size: 100%;
            }
        }
        .username {
            h2 {
                color: white;
            }
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            gap: 0.5rem;
            .username {
                h2 {
                    font-size: 1rem;
                }
            }
        }
    }
`;
