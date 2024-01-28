import React,{useEffect,useState} from "react";

const Header = () => {
    const [active,setActive] = useState(false)

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
  <div className={`${active === true? 'fixed top-0 z-30 left-0 right-0 w-full h-[70px] bg-blue-500' : 'relative'}w-full h-[70px] bg-blue-500`}>

  </div>
  </>;
};

export default Header;
