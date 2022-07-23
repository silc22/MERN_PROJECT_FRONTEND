import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import useProjects from "../hooks/useProjects"
import Alert from "./Alert"

const ProjectForm = () => {
    const [id, setId] = useState(null)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [deliveryDate, setDeliveryDate] = useState("")
    const [client, setClient] = useState("")
    const params = useParams()
    const {showAlert, alert, projectSubmit, project} = useProjects()
    

    useEffect(()=>{
        if(params.id){
            setId(project._id)
            setName(project.name)
            setDescription(project.description)
            setDeliveryDate(project.deliveryDate?.split("T")[0])
            setClient(project.client)
        }
        
    },[params])



    const handleSubmit = async e =>{
        e.preventDefault()

        if([name, description, deliveryDate, client].includes("")){
            showAlert({
                msg: "All fields are required",
                error: true
            })
            return
        }
       
        await projectSubmit({id, name, description, deliveryDate, client})
        setId(null)
        setName("")
        setDescription("")
        setDeliveryDate("")
        setClient("")
    }

    const { msg } = alert

    return(
        <>

       <form className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
       onSubmit={handleSubmit}>
         {msg && <Alert alert={alert}/>}
            <div className="mb-4">
                <label 
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="name"
                    >PROJECT NAME
                </label>
                <input
                id="name"
                className="w-full border p-2 mt-2 placeholder-gray-400 rounded-md"
                type="text"
                placeholder="Type the project name"
                value={name}
                onChange={e=>setName(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label 
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="description"
                    >description
                </label>
                <textarea
                id="description"
                className="w-full border p-2 mt-2 placeholder-gray-400 rounded-md"
                placeholder="¿What's your project about?"
                value={description}
                onChange={e=>setDescription(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label 
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="delivery-date"
                    >delivery Date
                </label>
                <input
                id="delivery-date"
                className="w-full border p-2 mt-2 placeholder-gray-400 rounded-md"
                type="date"
                value={deliveryDate}
                onChange={e=>setDeliveryDate(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label 
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="client"
                    >Client
                </label>
                <input
                id="client"
                className="w-full border p-2 mt-2 placeholder-gray-400 rounded-md"
                type="text"
                placeholder="Customer's name"
                value={client}
                onChange={e=>setClient(e.target.value)}
                />
            </div>
            <input
            type="submit"
            value={id? "Update project" : "Create project"}
            className="text-center w-full p-3 border bg-sky-600 uppercase text-xs text-white rounded hover:cursor-pointer  hover:bg-sky-700 transition-colors"
            />
       </form>
        </>
    )
}

export default ProjectForm