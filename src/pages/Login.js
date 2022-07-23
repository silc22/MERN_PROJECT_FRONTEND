import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alert from "../components/Alert"
import axiosClient from "../config/axiosClient"
import useAuth from "../hooks/useAuth"

const Login = () =>{

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [alert, setAlert] = useState({}) 

    const { setAuth } = useAuth();
    const navigate = useNavigate()

    const handleSubmit = async e =>{
        e.preventDefault()
        if([email, password].includes("")){
            setAlert({
                msg: "All fields are required",
                error: true
            })
            return
        }

        try{
            const { data } = await axiosClient.post('/users/login', {email, password})
            setAlert({})
            localStorage.setItem("token", data.token)
            setAuth(data)
            navigate("projects")
        }catch(error){
            setAlert({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const {msg} = alert

    return(
        <>
            <h1 className="text-sky-600 font-black text-2xl text-center capitalize py-2">
                Continue with your {''}
                <span className="text-slate-400">projects</span>
            </h1>

            { msg && <Alert alert={alert}/>  }

            <form 
            className="my-5 bg-white shadow rounded-lg p-5"
            onSubmit={handleSubmit}>
                <div className="text-xs p-1 ">
                    <label className="uppercase text-gray-600 block font-bold"
                    htmlFor="email">
                        E-mail:
                    </label>
                    <input 
                    id="email"
                    type="email"
                    placeholder="Registration E-mail"
                    className="rounded-lg p-1 my-1 w-full border"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    />    
                </div>
                <div className="text-xs p-1 ">
                    <label className="uppercase text-gray-600 block font-bold"
                    htmlFor="password">
                        Password:
                    </label>
                    <input 
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="rounded-lg p-1 my-1 w-full border"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    />    
                </div>
                <input
                type="submit"
                value="Login"
                className="text-center w-full p-1 border bg-sky-700 uppercase text-xs text-white rounded hover:cursor-pointer  hover:bg-sky-800 transition-colors"
           
                />
            </form>
            <nav className="lg:flex lg:justify-between">
                <Link
                to="/register"
                className="block text-center my-5 text-slate-500 uppercase text-xs"
                >Not registered yet? <span className="font-bold">Join us</span>
                </Link>
                <Link
                to="/forgot-password"
                className="block text-center my-5 text-slate-500 uppercase text-xs"
                >Forgot password
                </Link>
            </nav>
        </>
    )
}

export default Login