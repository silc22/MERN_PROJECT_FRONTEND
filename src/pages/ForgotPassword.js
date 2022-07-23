import { useState } from "react"
import { Link } from "react-router-dom"
import axiosClient from "../config/axiosClient";
import Alert from "../components/Alert";

const ForgotPassword = () =>{
    const [email, setEmail] = useState('')
    const [alert, setAltert] = useState({})

    const handleSubmit = async e => {
        e.preventDefault();
        if(email === '' || email.length < 6){
            setAltert({
                msg: "The email field cannot be empty",
                error: true
            })
            return
        }
       

        try{
            const { data } = await axiosClient.post(`/users/forgot-password`, { email })
            setAltert({
                msg: data.msg,
                error: false
            })
            return
        }catch(error){
            setAltert({
                msg: error.response.data,
                error: true
            })
            return
        }
    }
        const { msg } = alert
    
        return(
        <>

            <h1 className="text-sky-600 font-black text-2xl text-center capitalize py-2">
            Recover your password, don't lose your
                <span className="text-slate-400"> projects</span>
            </h1>
            {msg && <Alert alert={alert}/>}
            <form 
            className="my-5 bg-white shadow rounded-lg p-5"
            onSubmit={handleSubmit}
            >
                <div className="text-xs p-1 ">
                    <label className="uppercase text-gray-600 block font-bold"
                    htmlFor="email">
                        E-mail
                    </label>
                    <input 
                    id="email"
                    type="email"
                    placeholder="Enter your e-mail"
                    className="rounded-lg p-1 my-1 w-full border"
                    value={email}
                    onChange={e=> setEmail(e.target.value)}
                    />    
                </div>
               
                <input
                type="submit"
                value="Send instructions"
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
                to="/register"
                className="block text-center my-5 text-slate-500 uppercase text-xs"
                >Not registered yet? <span className="font-bold">Join us</span>
                </Link>
            </nav>
        </>
    )
}

export default ForgotPassword