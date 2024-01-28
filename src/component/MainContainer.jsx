import React,{useState,useEffect} from "react";
import {io} from "socket.io-client"
import Layout from "./layout/layout"
import {useSelector} from "react-redux"
const ENDPOINT = "http://localhost:8080"
function MainContainer() {
  const {user} = useSelector((state)=>state.user?.user)
  const userId = user?._id
  const socket = io(ENDPOINT, { transports: ["websocket"] })

  useEffect(() => {
    socket.emit('connection')
    
  }, []);
  
  return<>
  <div className="w-full h-[100vh] bg-neutral-200">
    <Layout />
  </div>
  </>;
}

export default MainContainer;
