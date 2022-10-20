import React, { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { Context } from "../../Context/Context";
import sockectIOClient from "socket.io-client";
import "./chatBox.css";
import Close from "@material-ui/icons/Close";
import Contact from "@material-ui/icons/ContactSupportRounded";
import Send from "@material-ui/icons/Send";
import HelpIcon from "@mui/icons-material/Help";

const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:5000"
    : window.location.host;

function ChatBox() {
  const { state } = useContext(Context);
  const { userInfo } = state;

  const [selectedUser, setSelectedUser] = useState({});
  const uiMessagesRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [messageBody, setMessageBody] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { name: "Admin", body: "Hello there, Please ask your question" },
  ]);

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        behavior: "smooth",
      });
    }
    if (socket) {
      socket.emit("onLogin", {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });
      socket.on("message", (data) => {
        setMessages([...messages, { body: data.body, name: data.name }]);
      });
    }
  }, [messages, socket, userInfo, isOpen]);

  const supportHandler = () => {
    setIsOpen(true);
    const sk = sockectIOClient(ENDPOINT);
    setSocket(sk);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert("Error. Please type message.");
    } else {
      setMessages([...messages, { body: messageBody, name: userInfo.name }]);
      setMessageBody("");
      setTimeout(() => {
        socket.emit("onMessage", {
          body: messageBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: userInfo._id,
        });
      }, 1000);
    }
  };
  const closeHandler = () => {
    setIsOpen(false);
  };
  return (
    <div className="chatbox">
      <div className="chat-box">
        {!isOpen ? (
          <div className="chat-box-open">
            <HelpIcon
              onClick={supportHandler}
              className="contact-chat-box active-icons"
            />
          </div>
        ) : (
          <div className="card card-body">
            <div className="card-style">
              <div className="card-row">
                <strong>Support</strong>
                <Close
                  onClick={closeHandler}
                  className="close-message-box active-icons"
                />
              </div>
              <div className="chat-height">
                <div className="chat-scroll" ref={uiMessagesRef}>
                  <ul>
                    {messages.map((msg, index) => (
                      <li
                        key={index}
                        className={
                          userInfo.name === msg.name
                            ? "chat-list "
                            : "reguler-chat"
                        }
                      >
                        <strong className="mss-ww">{`${msg.name}:`}</strong>
                        {msg.body}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <form action="" onSubmit={submitHandler} className="form-row">
                  <input
                    type="text"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="type message here"
                  />
                  <Send
                    onClick={submitHandler}
                    className="chat-box-send active-icons"
                  />
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBox;
