import {useEffect, useState} from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../config/axiosClient";
import Alert from "../components/Alert"


const ConfirmAccount = ()=>{

    const params = useParams()
    const {id} = params
    const [alert, setAlert] = useState({})
    const [confirm, setConfirm] = useState(false)

 useEffect(()=>{
     const confirmRegister = async () =>{
         try{
            const {data} = await axiosClient(`/users/confirm/${id}`)
            setAlert({
                msg: data.msg,
                error: false
            })
            setConfirm(true)
         }catch(error){
             setAlert({
                 msg: error.response.data.msg,
                 error: true
             })
         }
     }
     confirmRegister()
 }, [])

 const {msg} = alert

    return(
        <>
            {msg && <Alert alert={alert}/>}
            {confirm ? 
                <>
                    <div className="flex justify-center flex-col">
                        <h1 className="text-sky-600 font-black text-2xl text-center capitalize py-2">
                        ¡Your account was successfully registered! You can now access your <span className="text-slate-400"> projects</span>
                        </h1>
                        <Link
                        to="/"
                        className="text-center w-full p-1 border bg-sky-700 uppercase text-xs text-white rounded hover:cursor-pointer  hover:bg-sky-800 transition-colors"
                        > Login
                        </Link>
                    </div>
                </>
            :
                <h1 className="text-sky-600 font-black text-2xl text-center capitalize py-2">
                    ¡Ups! Something went wrong,
                    <span className="text-slate-400"> please try again</span>
                </h1> 
            }
        </>
    )
}

export default ConfirmAccount