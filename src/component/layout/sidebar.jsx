import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "timeago.js";

const ENDPOINT = "https://chatting-socket-c5k9.onrender.com";
function Sidebar() {
  const socket = io(ENDPOINT, { transports: ["websocket"] });
  const { allUsers } = useSelector((state) => state.allUsers);
  const { user } = useSelector((state) => state.user.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [incomming,setIncomming] = useState(null)
  const { conversations } = useSelector(
    (state) => state.conversations.conversations
  );
  const [lastMessage,setLastMessage] = useState({})
  const me = user?._id;
  const navigate = useNavigate();
  const token = `${localStorage.getItem("token")}`;
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const search = () => {
    if (query !== "") {
      const res = allUsers?.users?.filter(
        (otherUser) =>
          otherUser.name.toLowerCase().includes(query.toLowerCase()) &&
          otherUser._id !== user._id
      );
      setData(res);
    } else {
      setData([]);
    }
  };
 {/* useEffect(() => {
    socket.on('getMessage',(data)=>{
      setIncomming({
        message:data.text,
        sender:data.sender,
        createdAt:Date.now()
      })
    })
  }, []);
  const currentConversation = conversations?.map((conversation)=>{
    return conversation.lastMessage = lastMessage
  })
  useEffect(() => {
    incomming &&
      currentConversation?.members.includes(incomming.sender) &&
      setLastMessage((prev) => [...prev, incomming]);
  }, [incomming, currentConversation]);
*/}

  useEffect(() => {
    search();
  }, [query]);

  const handleCreateConversation = async (receiver) => {
    try {
      const groupTitle = user._id + receiver._id;
      const senderId = user?._id;
      const receiverId = receiver?._id;
      const response = await axios.post(
        "https://chatting-web-app-2xe3.onrender.com/api/v2/conversation/create-new-conversation",
        {
          groupTitle: groupTitle,
          senderId: senderId,
          receiverId: receiverId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const { conversation } = response.data;

      const newConversationId = response.data.conversation._id;
      navigate(`/chat/${conversation._id}`);
    } catch (error) {
      alert("something went wrong");
      console.log(error);
    }
  };
  useEffect(() => {
    socket.on("getUsers", (data) => {
      setOnlineUsers(data);
    });
  }, [user]);

  return (
    <>
      <div className="px-2 mt-4  h-screen">
        <div>
          <div className="w-full h-10 bg-slate-100 shadow-lg justify-center items-center">
            <input
              type="text"
              placeholder="search..."
              id=""
              className="border-none w-full rounded-xl px-3 h-[45px]"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          {conversations && conversations.length !== 0 ? (
            <>
              {conversations.map((conversation, index) => {
                const otherMember = conversation.members.find(
                  (member) => member !== me
                );
                const otherUser = allUsers.users.find(
                  (user) => user._id === otherMember
                );
                const online = onlineUsers.find(
                  (user) => user?.userId === otherMember
                );
                const initialLetter = otherUser ? otherUser.name[0] : "";

                return (
                  <div key={index}>
                    <Link
                      to={{
                        pathname: `/chat/${conversation._id}`,
                        state: { otherMember },
                      }}
                    >
                      <div className="mt-2 flex items-center cursor-pointer justify-between">
                        <div className="flex items-center">
                          <div className="w-[35px] h-[35px] flex rounded-full relative bg-gray-500 justify-center items-center">
                            <h3 className="text-xl text-black text-center">
                              {initialLetter}
                            </h3>
                            <div
                              className={
                                online
                                  ? "w-[12px] h-[12px] rounded-full bg-green-400 absolute top-1 left-[25px]"
                                  : null
                              }
                            ></div>
                          </div>
                          <div className="mx-2 flex flex-row">
                            {conversation.lastMessageId === me ? (
                              <>
                                <p>You:</p>
                                <p className="text-center text-neutral-500 mx-1">
                                  {conversation?.lastMessage?.length > 13
                                    ? conversation.lastMessage.slice(0, 13) +
                                      "..."
                                    : conversation?.lastMessage}
                                </p>
                              </>
                            ) : (
                              <>
                                <p>{otherUser.name[0]}:</p>
                                <p className="text-center text-neutral-500 mx-1">
                                  {conversation?.lastMessage?.length > 13
                                    ? conversation.lastMessage.slice(0, 13) +
                                      "..."
                                    : conversation?.lastMessage}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          {conversation.lastMessageId !== me && (
                            <p className="text-right text-neutral-500">
                              {format(conversation.updatedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="h-screen w-full justify-center items-center">
              <h2 className="text-black text-xl text-center">
                You don't have any chats to view
              </h2>
            </div>
          )}
        </div>
      </div>

      {data && data.length !== 0 && (
        <div className="absolute bg-neutral-300 top-[70px] px-2 w-[80%] left-10 800px:left-5 800px:w-[22%] z-30">
          {data.map((receiver, index) => (
            <div
              key={index}
              className="my-2 cursor-pointer"
              onClick={() => handleCreateConversation(receiver)}
            >
              <div className="flex flex-row items-center ">
                <div className="w-[35px] h-[35px] rounded-full bg-green-500 justify-center mx-2">
                  <h2 className="text-center text-black font-bold text-xl">
                    {receiver.name[0]}
                  </h2>
                </div>
                <p className="text-black">{receiver.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Sidebar;
