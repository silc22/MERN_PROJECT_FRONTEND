import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useProjects from "../hooks/useProjects"
import ProjectForm from "../components/ProjectForm"

const EditProject = () => {
    const params = useParams()
    const { getProject , project, loading, deleteProject } = useProjects()

    const {name, description,  deliveryDate, client} = project

    useEffect(()=>{
        getProject(params.id)
    },[])

    
    const handleClick = () =>{
        if(window.confirm("Do you want to delete this project?")){
            deleteProject(params.id)
        }
    }
    
    
    if(loading) return "Cargando..."
    
    
    return(
        <>
        <div className="flex justify-between">
            <h1 className="font-black text-4xl"> Edit project: {name} </h1>
            <div className="flex items-center gap-2 text-gray-400 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <button 
                className="uppercase font-bold"
                onClick={handleClick}>
                    Delete
                </button>
            </div>
        </div>

        <div className="mt-10 flex justify-center">
            <ProjectForm/>
        </div>
        </>
    )
}

export default EditProject