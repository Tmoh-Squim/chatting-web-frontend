import React from "react";
import Main from "./main"
import Sidebar from "./sidebar"
import Header from "./Header"
function layout() {
  return <>
  <Header />
  <div className="flex ">
  <div className=" 800px:w-[25%] w-full md:w-[40%]  sm:w-[40%] h-screen bg-white">
 <Sidebar />
  </div>
  <div className=" ml-2 w-[100%] 800px:w-[75%] hidden md:w-[60%] sm:w-[60%] 800px:block md:block h-screen bg-white">
  <Main />
  </div>
  </div>
  </>;
}

export default layout;
