import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import useProjects from "../hooks/useProjects"
import useAdmin from "../hooks/useAdmin"
import ModalTask from "../components/ModalTask"
import ModalDeleteTask from "../components/ModalDeleteTask"
import ModalDeleteCollaborator from "../components/ModalDeleteCollaborator"
import Task from "../components/Task"
import Collaborator from "../components/Collaborator"
import io from "socket.io-client"

let socket;

const Project = () =>{

    const params = useParams()
    const { getProject , project, loading, handleModalTask, alert, submitProjectTasks, deleteProjectTasks, updateProjectTasks,changeStatusTask } = useProjects()
    const { name } = project
    const admin = useAdmin()

    

    useEffect(()=>{
        getProject(params.id)
       
    },[])

    useEffect(()=>{
        socket = io(process.env.REACT_APP_BACKEND_URL)
        socket.emit('open project', params.id)
    },[])


    useEffect(()=>{
        socket.on('added task', newTask=>{
            if(newTask.project === project._id){
                submitProjectTasks(newTask)
            }
        });

        socket.on("deleted task", deletedTask=>{
            if(deletedTask.project === project._id){
                deleteProjectTasks(deletedTask)
            }
        });

        socket.on("updated task", updatedTask =>{
            if(updatedTask.project._id === project._id){
                updateProjectTasks(updatedTask)
            }
        });

        socket.on("new state", newStateTask =>{
            if(newStateTask.project._id === project._id){
                changeStatusTask(newStateTask)
            }
        });

    })

    if(loading) return "Cargando..."



    return(
       
        <>
        <div className="flex justify-between ">
            <h1  className="text-4xl font-black">
                {name}
            </h1>


           {admin && (
            <div className="flex items-center gap-2 text-gray-400 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <Link
                to={`/projects/edit/${params.id}`}
                className="uppercase font-bold"
                >Edit
                </Link>
            </div>
            )}

        </div>

        {admin && (    
        <button
            onClick={handleModalTask}
            type="button"
            className="text-sm mt-5 px-5 py-2 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center flex justify-center gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            New Task
        </button>
        )}

        <p className="font-bold text-xl mt-10">Project tasks</p>


        <div 
        className="bg-white shadow mt-10 rounded-lg">
            {project.tasks?.length ? 
            project.tasks?.map(task => (
                <Task 
                key={task._id} 
                task={task}
                />  
            )) : 
            <p 
            className="text-center text-gray-600 uppercase py-5 my-2">
                No tasks in this project
            </p>}
        </div>
        
        {admin && (
        <>
        <div className="flex items-center justify-between mt-10 "> 
            <p className="font-bold text-xl">Collaborators</p>
            <Link 
            to={`/projects/new-collaborator/${project._id}`}
            className="text-gray-400 hover:text-black uppercase font-bold">Add</Link>
        </div>

        <div 
        className="bg-white shadow mt-10 rounded-lg">
            {project.collaborators?.length ? 
            project.collaborators?.map(collaborator => (
                <Collaborator
                key={collaborator._id} 
               collaborator={collaborator}
                />  
            )) : 
            <p 
            className="text-center text-gray-600 uppercase py-5 my-2">
               No collaborators in this project
            </p>}
        </div>
        </>
        )}
         
        <ModalTask />
        <ModalDeleteTask/>
        <ModalDeleteCollaborator/>
        </>
    )
}

export default Project
