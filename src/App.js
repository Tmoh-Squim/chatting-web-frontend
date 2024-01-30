import React,{useEffect,useState} from "react";
import "./App.css"
import {Routes,Route} from "react-router-dom"
import {io} from "socket.io-client"
import MainContainer from "./component/MainContainer"
import ChatContainer from "./component/ChatContainer"
import Register from "./auth/Register"
import Login from "./auth/Login"
import {useDispatch,useSelector} from "react-redux"
import store from "./redux/store"
import {LoadUser,getAllusers} from "./redux/users"
import {getAllConversation} from "./redux/conversations"
import UserProfile from "./component/user/UserProfile"

const ENDPOINT = "https://chatting-socket-c5k9.onrender.com"
function App() {
  const dispatch = useDispatch()
  const [onlineUsers,setOnlineUsers] = useState([])
  const {user} = useSelector((state)=>state.user?.user)
  const socket = io(ENDPOINT, { transports: ["websocket"] })
  useEffect(() => {
    store.dispatch(LoadUser())
    store.dispatch(getAllusers())
  }, [store]);
  useEffect(() => {
    const id = user?._id
    dispatch(getAllConversation(id))
  }, [user]);

  useEffect(() => {
    socket.emit('connection')
    socket.emit('join',({userId:id}))
    socket.on('getUsers',(data)=>{
      setOnlineUsers(data)
    })
  }, [user]);
  useEffect(() => {
    socket.on("getMessage",(data)=>{
      console.log("incomming",data);
      
    })
  }, []);
  
  
  return <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<MainContainer />} />
        <Route path="/chat/:id" element={<ChatContainer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-profile" element={<UserProfile />} />
      </Routes>
  </>
}

export default App;
