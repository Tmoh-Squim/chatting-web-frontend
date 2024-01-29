import React,{useState,useEffect} from "react";
import { AiOutlineEye,AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios"
import {useNavigate,Link} from "react-router-dom"
import {useSelector} from "react-redux"
function Login() {
    const [visible,setVisible] = useState(false)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {user} = useSelector((state)=>state.user)
    const navigate = useNavigate()

    const handleSubmit =async () =>{
        try {
          const response = await axios.post('https://chatting-web-app-2xe3.onrender.com/api/v1/auth/login',{email:email,password:password})
          const {token} = response.data
          localStorage.setItem('token',token)
          alert(response.data.message)
          
        } catch (error) {
          alert('something went wrong')
        }
    }
    useEffect(() => {
      if (user?.user){
        navigate('/home')
      }
    }, [user]);
    
  return <>
    <div className="flex justify-center items-center px-2 800px:px-5 h-screen w-full bg-slate-100">
        <div
          className="w-full 800px:w-[35%] px-2 flex flex-col bg-white py-8"
        >
          <div className="mt-2 my-2">
            <h2 className="text-2xl text-black font-semibold text-center">
              Welcome Back!
            </h2>
          </div>
          <div className="flex flex-col mt-10">
            <label htmlFor="email">Enter Your Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              id=""
              placeholder="Enter your email"
              required
              className="border w-full px-3 my-3 border-black h-[45px] rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <div>
            <label htmlFor="password">Enter Password</label>
            </div>
            <div className="relative">
            <input
              type={`${visible === true ? 'text' : 'password'}`}
              placeholder="Enter password"
              name="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              id=""
              required
              className="border w-full px-3 my-3 border-black h-[45px] rounded-lg"
            />
            <div className="absolute right-2 top-5 cursor-pointer">
                {
                    visible === true ? (
                        <AiOutlineEyeInvisible size={30} color="black" onClick={()=>setVisible(false)} />
                    ):(
                        <AiOutlineEye size={30} color="black" onClick={()=>setVisible(true)} />
                    )
                }
              
            </div>
            </div>
          </div>
          <button type="submit" onClick={handleSubmit} className="p-2 bg-red-500 rounded-lg w-[30%] my-2 mx-2">
            <h2 className="text-xl text-white font-semibold text-center">Login</h2>
          </button>
        </div>

       <p>don't have an account? <Link to="/register">Create</Link></p> 
      </div>
  </>;
}

export default Login;
