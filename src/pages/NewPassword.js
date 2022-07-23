import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axiosClient from "../config/axiosClient"
import Alert from "../components/Alert"

const NewPassword = () =>{

    const params = useParams()
    const {token} = params
    const [alert, setAlert] = useState({})
    const [validToken, setValidToken] = useState(false)
    const [password, setPassword] = useState("")
    const [changedPassword, setChangedPassword] = useState(false)


    useEffect(()=>{
        const checkToken = async () =>{
            try{
                await axiosClient(`/users/forgot-password/${token}`)  
                setValidToken(true)
            }catch(error){
               setAlert({
                   msg: error.response.data.msg,
                   error: true
               })
            }
        }

        checkToken()
    }, [])

    const handleSubmit = async e =>{
        e.preventDefault()
        if(password.length < 6){
            setAlert({
                msg: "Password must be at least 6 characters long",
                error: true
            })
            return
        }


        try{
            const {data} = await axiosClient.post(`/users//forgot-password/${token}`, {password})
            setAlert({
                msg: data.msg,
                error: false
            })
            setChangedPassword(true)
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
        {
            validToken?
            <>
                <h1 className="text-sky-600 font-black text-2xl text-center capitalize py-2">
                Reset your password and access your 
                    <span className="text-slate-400"> projects</span>
                </h1>
                {msg && <Alert alert={alert}/>}
                <form 
                className="my-5 bg-white shadow rounded-lg p-5"
                onSubmit={handleSubmit}
                >
                    <div className="text-xs p-1 ">
                        <label className="uppercase text-gray-600 block font-bold"
                        htmlFor="password">
                        New Password
                        </label>
                        <input 
                        id="password"
                        type="password"
                        placeholder="Write your new password"
                        className="rounded-lg p-1 my-1 w-full border"
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                        />    
                    </div>
                    <input
                    type="submit"
                    value="Save new password"
                    className="text-center w-full p-1 border bg-sky-700 uppercase text-xs text-white rounded hover:cursor-pointer  hover:bg-sky-800 transition-colors"
                    />
                </form>
                {
                    changedPassword && (
                        <>
                    <div className="flex justify-center flex-col">
                        <h1 className="text-sky-600  text-center py-2">
                        Please login again to access your <span className="text-slate-400"> projects</span>
                       
                        </h1>
                        <Link
                        to="/"
                        className="text-center w-full p-1 border bg-sky-700 uppercase text-xs text-white rounded hover:cursor-pointer  hover:bg-sky-800 transition-colors"
                        > Click here to Login
                        </Link>
                    </div>
                        </>
                )}
            </>
            :
            <>
            <h1 className="text-sky-600 font-black text-2xl text-center capitalize py-2">
            !Ups! Something went wrong, 
                <span className="text-slate-400"> please try again</span>
            </h1>
            {msg && <Alert alert={alert}/>}
            </>
        }

            
            
        </>
    )
}

export default NewPassword