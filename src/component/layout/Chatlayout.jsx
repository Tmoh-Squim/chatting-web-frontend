import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./sidebar";
import {io} from "socket.io-client"
import Header from "./Header";
import { useParams } from "react-router-dom";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "timeago.js";
const token = `${localStorage.getItem("token")}`;
const ENDPOINT= "https://chatting-socket-c5k9.onrender.com"
function Chatlayout() {
  const { user } = useSelector((state) => state.user?.user);
  const socket = io(ENDPOINT, { transports: ["websocket"] });
  const { conversations } = useSelector(
    (state) => state.conversations.conversations
  );
  const {allUsers} = useSelector((state)=>state.allUsers)
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [incomingMessage,setInComigMessage] = useState(null)

  const { id } = useParams();
  const conversationId = id;
  const containerRef = useRef(null);
  const me = user?._id;
  const currentConversation = conversations?.find(conversation => conversation._id === id);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      const newMessage = {
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      };
        console.log('newmsg',newMessage);

      setInComigMessage(newMessage);
      // Append the new message to the existing messages
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });
  }, []);

  useEffect(() => {
    incomingMessage &&
      currentConversation?.members.includes(incomingMessage.sender) &&
      setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage, currentConversation]);

  const receiverId = currentConversation?.members?.find((member)=>member !== me)
  const receiver = allUsers?.users?.find((user)=>user._id === receiverId)

  const handleChat = async () => {
    if (text === "") {
      return;
    } else {
      socket.emit("createMessage", {
        senderId: me,
        receiverId:receiverId,
        text: text,
      });
      await axios
        .post(
          "https://chatting-web-app-2xe3.onrender.com/api/v2/message/create-new-message",
          { text: text, sender: me, conversationId: conversationId },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          setMessages([...messages, res.data.message]);
          updateLastMessage();
          setText("");
        });
    }
  };

  const updateLastMessage = async () => {
    socket.emit("updateLastMessage", {
      lastMessage: text,
      lastMessageId: me,
      receiverId:receiverId
    });
    await axios
      .put(
        `https://chatting-web-app-2xe3.onrender.com/api/v2/conversation/update-conversation/${conversationId}`,
        { lastMessage: text, lastMessageId: me },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      });
  }; 
  

  useEffect(() => {
    const getMessages = async () => {
      const res = await axios.get(
        `https://chatting-web-app-2xe3.onrender.com/api/v2/message/get-messages/${conversationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMessages(res.data.messages);
    };
    getMessages();
  }, [id]);

  useEffect(() => {
    // Check if containerRef.current is not null before setting scrollTop
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  

  return (
    <>
      <div className="flex 800px:mx-5 !m-0">
        <div className=" 800px:w-[25%] hidden 800px:block overflow-y-scroll h-screen bg-white">
          <Sidebar />
        </div>
        <div className="ml-2 w-[100%] 800px:w-[75%] relative justify-between flex flex-col h-screen bg-white">
        <div className="bg-blue-400 h-[65px] w-full px-2">
          <div className="w-[50px] h-[50px]  rounded-full justify-center items-center bg-neutral-400">
            <h2 className="text-red-500 font-bold  text-center text-xl">
              {receiver?.name[0]}
            </h2>
          </div>
</div>
          <div
            className="h-[100vh] overflow-y-scroll overflow-x-hidden w-full"
            ref={containerRef}
          >
            {messages &&
              messages.map((message, index) => {
                const senderMessage = message.sender === me;
                return (
                  <div key={index} className={`px-2 w-full`}>
                    <div
                      className={`${
                        senderMessage ? "justify-end" : "justify-start"
                      } flex w-full my-1.5 `}
                    >
                      {senderMessage ? (
                        <div className="flex flex-col w-[65%] justify-end items-end">
                          <p
                            className=" bg-blue-500 p-1 text-end text-black rounded-xl h-min inline-block "
                            style={{ maxWidth: "fit-content" }}
                          >
                            {message.text}
                          </p>
                          <p className="text-end">
                            {format(
                              message?.createdAt ? message.createdAt : null
                            )}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col w-[65%]">
                          <div
                            className=" bg-neutral-500 p-1 text-black rounded-lg h-min inline-block"
                            style={{ maxWidth: "fit-content" }}
                          >
                            {message.text}
                          </div>
                          <p className="text-start">
                            {format(
                              message?.createdAt ? message.createdAt : null
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          {/* Text input section */}
          <div className="w-full px-2 mb-2 justify-between items-center">
            <div className="w-[25%]"></div>
            <div className="w-[98%] mx-auto 800px:w-[50%]">
              <div className="relative justify-center items-center">
                <input
                  type="text"
                  id=""
                  value={text}
                  className="h-[45px] rounded-lg border w-full border-black border-2px pl-9"
                  placeholder="Write message.."
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <div className="absolute bottom-4 left-2 800px:left-[25%]">
                <AiOutlinePaperClip size={28} color="gray" />
              </div>
              <div
                className="absolute bottom-4 right-2 800px:right-[26%]"
                onClick={handleChat}
              >
                <AiOutlineSend size={28} color="gray" />
              </div>
            </div>
            <div className="w-[25%]"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatlayout;
