import React,{useEffect,useState} from "react";
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"

const Header = () => {
  const {user} = useSelector((state)=>state.user?.user)
    const [active,setActive] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
      window.addEventListener('scroll',()=>{
        if(window.scrollY > 70){
            setActive(true)
        }else{
            setActive(false)
        }
      })
    }, []);
    console.log(active)
    
  return <>
  <div className={`${active === true? 'fixed top-0 z-30 left-0 right-0 w-full h-[70px] bg-blue-500 items-center px-2' : 'relative'} w-full h-[70px] justify-between px-2 items-center bg-blue-500`}>
  <div className="w-[50px] h-[50px] rounded-full items-center justify-center mt-auto flex cursor-pointer bg-neutral-500" onClick={()=>navigate("/user-profile")}>
  <h3 className="text-xl text-green-500 text-center">
    {user?.name[0]}
  </h3>
  </div>
  </div>
  </>;
};

export default Header;
