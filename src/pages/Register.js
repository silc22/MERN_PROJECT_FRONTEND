import { useState } from "react"
import { Link } from "react-router-dom"
import Alert from "../components/Alert"
import axiosClient from "../config/axiosClient"

const Register = () =>{
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [alert, setAlert] = useState({})

    const handleSumbit = async e =>{
        e.preventDefault();

        if([name, email, password, repeatPassword].includes("")){
           setAlert({
               msg: "All fields are required",
               error: true
           })
           return
        }

        if(password !== repeatPassword){
            setAlert({
                msg: "Passwords do not match",
                error: true
            })
            return
        }

        if(password.length < 6){
            setAlert({
                msg: "Password must be longer than 6 characters",
                error: true
            })
            return
        }

        
        try{
            const { data } = await axiosClient.post(`/users`, {name, email, password})
            setAlert({
                msg: data.msg,
                error: false
            }) 
            setName("")
            setEmail("")
            setPassword("")
            setRepeatPassword("")
        }catch(error){
            setAlert({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alert

    return(
        <>
            <h1 className="text-sky-600 font-black text-2xl text-center capitalize py-2">
            Create your account and start your 
                <span className="text-slate-400"> project</span>
            </h1>

            {msg && <Alert alert={alert}/>}

            <form 
            className="my-5 bg-white shadow rounded-lg p-5"
            onSubmit={handleSumbit}
            >
            <div className="text-xs p-1 ">
                    <label className="uppercase text-gray-600 block font-bold"
                    htmlFor="name">
                        Name
                    </label>
                    <input 
                    id="name"
                    type="text"
                    placeholder="Name"
                    className="rounded-lg p-1 my-1 w-full border"
                    value={name}
                    onChange={e=>setName(e.target.value)}
                    />    
                </div>
                <div className="text-xs p-1 ">
                    <label className="uppercase text-gray-600 block font-bold"
                    htmlFor="email">
                        E-mail
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
                        Password
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
                <div className="text-xs p-1 ">
                    <label className="uppercase text-gray-600 block font-bold"
                    htmlFor="password2">
                        Repeat your password
                    </label>
                    <input 
                    id="password2"
                    type="password"
                    placeholder="Repeat it"
                    className="rounded-lg p-1 my-1 w-full border"
                    value={repeatPassword}
                    onChange={e=>setRepeatPassword(e.target.value)}
                    />    
                </div>

                <input
                type="submit"
                value="Create account"
                className="text-center w-full p-1 border bg-sky-700 uppercase text-xs text-white rounded hover:cursor-pointer  hover:bg-sky-800 transition-colors"
                />
            </form>
            <nav className="lg:flex lg:justify-between">
                <Link
                to="/"
                className="block text-center my-5 text-slate-500 uppercase text-xs"
                >already registered? <span className="font-bold">Log in</span>
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

export default Register