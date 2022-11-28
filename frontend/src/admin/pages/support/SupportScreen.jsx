import React, { useContext } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import MessageBox from "../../../components/Utilities/MessageBox";
import { Context } from "../../../Context/Context";
import socketIOClient from "socket.io-client";
import "./supportScreen.css";
import SendIcon from "@mui/icons-material/Send";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import Footer from "../../../components/Footer/Footer";
import { Helmet } from "react-helmet-async";

let allUsers = [];
let allMessages = [];
let allSelectedUser = {};
const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:5000"
    : window.location.host;

function SupportScreen() {
  const [selectedUser, setSelectedUser] = useState({});
  const [socket, setSocket] = useState(null);
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const uiMessagesRef = useRef(null);

  const { state } = useContext(Context);
  const { userInfo } = state;

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        behavior: "smooth",
      });
    }

    if (!socket) {
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
      sk.emit("onLogin", {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });
      sk.on("message", (data) => {
        if (allSelectedUser._id === data._id) {
          allMessages = [...allMessages, data];
        } else {
          const existUser = allUsers.find((user) => user._id === data._id);
          if (existUser) {
            allUsers = allUsers.map((user) =>
              user._id === existUser._id ? { ...user, unread: true } : user
            );
            setUsers(allUsers);
          }
        }
        setMessages(allMessages);
      });
      sk.on("updateUser", (updatedUser) => {
        const existUser = allUsers.find((user) => user._id === updatedUser._id);
        if (existUser) {
          allUsers = allUsers.map((user) =>
            user._id === existUser._id ? updatedUser : user
          );
          setUsers(allUsers);
        } else {
          allUsers = [...allUsers, updatedUser];
          setUsers(allUsers);
        }
      });
      sk.on("listUsers", (updatedUsers) => {
        allUsers = updatedUsers;
        setUsers(allUsers);
      });
      sk.on("selectUser", (user) => {
        allMessages = user.messages;
        setMessages(allMessages);
      });
    }
  }, [messages, socket, users, userInfo]);

  const selectUser = (user) => {
    allSelectedUser = user;
    setSelectedUser(allSelectedUser);
    const existUser = allUsers.find((x) => x._id === user._id);
    if (existUser) {
      allUsers = allUsers.map((x) =>
        x._id === existUser._id ? { ...x, unread: false } : x
      );
      setUsers(allUsers);
    }
    socket.emit("onUserSelected", user);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert("Error. Please type message.");
    } else {
      allMessages = [
        ...allMessages,
        { body: messageBody, name: userInfo.name },
      ];
      setMessages(allMessages);
      setMessageBody("");
      setTimeout(() => {
        socket.emit("onMessage", {
          body: messageBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: selectedUser._id,
        });
      }, 1000);
    }
  };
  return (
    <>
      <div className="support">
        <div className="support-screen">
          <Helmet>
            <title>Products</title>
          </Helmet>
          <div className="support-box">
            <div className="users-box">
              <div className="header-box messgechat-user">USERS</div>
              {users.filter((x) => x._id !== userInfo._id).length === 0 && (
                <MessageBox>No Online User Found</MessageBox>
              )}
              <ul>
                {users
                  .filter((x) => x._id !== userInfo._id)
                  .map((user) => (
                    <li key={user._id}>
                      <button
                        className={
                          user._id === selectedUser._id
                            ? "block-btn"
                            : "selected"
                        }
                        type="buton"
                        onClick={() => selectUser(user)}
                      >
                        <div className="btn-users">
                          <PermIdentityIcon />
                          {user.name}
                        </div>
                        <div
                          id="info-status"
                          className={
                            user.unread
                              ? "unread"
                              : user.online
                              ? "online"
                              : "offline"
                          }
                        ></div>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="message-box">
              <div className="header-box pad messgechat-messages">MESSAGES</div>
              {!selectedUser._id ? (
                <MessageBox>Select a user to start chat</MessageBox>
              ) : (
                <div>
                  <div className="messages-row">
                    <strong className="messages-row-strong">
                      Chat with{" "}
                      <RecordVoiceOverIcon className="messages-row-strong-icon" />
                      {selectedUser.name}
                    </strong>
                  </div>
                  <div className="message-box-scroll">
                    <div className="message-scroll" ref={uiMessagesRef}>
                      <ul>
                        {messages.length === 0 && (
                          <li className="no-msg">No Message.</li>
                        )}
                        <div className="message-list-all">
                          {messages.map((msg, index) => (
                            <li
                              key={index}
                              className={
                                msg.isAdmin
                                  ? "message-list"
                                  : msg._id === msg.selectedUser
                                  ? "message-list"
                                  : "reguler-user"
                              }
                            >
                              <strong>{`${msg.name}: `}</strong>
                              <p className="message-body">{msg.body}</p>
                            </li>
                          ))}
                        </div>
                      </ul>
                    </div>
                  </div>
                  <form
                    action=""
                    onSubmit={submitHandler}
                    className="message-form"
                  >
                    <input
                      type="text"
                      className="message-input"
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      placeholder="type message here"
                    />
                    <SendIcon
                      className="message-send"
                      onClick={submitHandler}
                    />
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default SupportScreen;
