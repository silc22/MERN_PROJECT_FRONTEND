import { useState, useEffect, createContext } from "react";
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom"
import io from "socket.io-client"
import useAuth from "../hooks/useAuth"

let socket;

const ProjectsContext = createContext();

const ProjectsProvider = ({children}) =>{

    const [ projects, setProjects ] = useState([])
    const [ alert, setAlert ] = useState({})
    const [ project, setProject ] = useState({})
    const [ loading, setLoading ] = useState(false)
    const [ modalTask, setModalTask ] = useState(false)
    const [ task, setTask ] = useState({})
    const [ modalDeleteTask, setModalDeleteTask ] = useState(false)
    const [ collaborator, setCollaborator ] = useState({})
    const [ modalDeleteCollaborator, setModalDeleteCollaborator ] = useState(false)
    const [ searcher, setSearcher ] = useState(false)

    const navigate = useNavigate()
    const { auth } = useAuth()


    useEffect(()=>{
        const getProjects = async ( ) =>{
            try{
                const token = localStorage.getItem("token")
                if(!token) return

                const config = {
                    headers:{
                        "Content-Type" : "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await axiosClient("/projects", config)
                setProjects(data)

            }catch(error){
                console.log(error)
            }
        }
        getProjects()
    },[auth])


    useEffect(()=>{
        socket = io(process.env.REACT_APP_BACKEND_URL)
    },[])

    const showAlert = (alert) =>{
        setAlert(alert)

        setTimeout(()=>{
            setAlert({})
        },[5000])
    }

    const projectSubmit = async project => {
        if(project.id){
            editProject(project)
        }else{
            newProject(project)
        }

        
    }


    const editProject = async project => {
        try{

            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers:{
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await axiosClient.put(`/projects/${project.id}`, project, config)

            const updatedProjects = projects.map(stateProject => stateProject._id === data._id? data : stateProject)
            setProjects(updatedProjects)

            setAlert({
                msg: "Project successfully updated",
                error: false
            })

            setTimeout(()=>{
                setAlert({})
                navigate("/projects")
            },[3000])

        }catch(error){
            console.log(error.response.data.msg)
        }
    }

    const newProject = async project => {
        try{
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers:{
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await axiosClient.post("/projects", project, config)

            setProjects([...projects, data])

            setAlert({
                msg: "Project successfully created",
                error: false
            })

            setTimeout(()=>{
                setAlert({})
                navigate("/projects")
            },[3000])

        }catch(error){
            console.log(error.response.data)
        }
    }

    const getProject = async id =>{
        setLoading(true)
        try{
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            
            const {data} = await axiosClient(`/projects/${id}`, config)
            setProject(data)
            setAlert({})
        }catch(error){
            navigate("/projects")
            setAlert({
                msg: error.response.data.msg,
                error: true
            })
            
            setTimeout(()=>{
                setAlert({})
            },3000)
        }
        setLoading(false)
    }
   
    const deleteProject = async id =>{
        try{
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

           const { data } = await axiosClient.delete(`/projects/${id}`, config)

            const updatedProjects = projects.filter(stateProject => stateProject._id !== id)
            setProjects(updatedProjects)

           setAlert({
            msg: data.msg,
            error: false
        })

        setTimeout(()=>{
            setAlert({})
            navigate("/projects")
        },[3000])


        }catch(error){
            console.log(error.response.data.msg)
        }
    }

    const handleModalTask = () =>{
        setModalTask(!modalTask)
        setTask({})
    }

    const taskSubmit = async task =>{
        if (task?.id) {
           await editTask(task)
        }else{
           await createTask(task)
        }
    }


    const createTask = async (task) =>{
        try{
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

           const { data } = await axiosClient.post("/task", task, config)

            
            setAlert({})
            setModalTask(false)

            //socke io
            socket.emit("new task", data)
            

        }catch(error){
            console.log(error.response.data.msg)
        }
    }

    const editTask = async (task) => {
        try{
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.put(`/task/${task.id}`, task, config)
            
          

           setAlert({})
           setModalTask(false)

           //SOCKET
            socket.emit("update task", data)


        }catch(error){
            console.log(error)
        }
    }

    const handleModalEditTask = task => {
        setTask(task)
        setModalTask(true)
    }
      
    const handleModalDeleteTaks = task => {
        setTask(task)
        setModalDeleteTask(!modalDeleteTask)
    }

    const deleteTask = async () => {
        try{
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await axiosClient.delete(`/task/${task._id}`, config)
            console.log(data)
            setAlert({
                msg: data,
                error: false
            })

            
            
            setModalDeleteTask(false)
            
            //SOCKET
            socket.emit("delete task", task)

            setTask({})
            setTimeout(()=>{
                setAlert({})
            },[3000])
            

        }catch(error){
            console.log(error)
        }
    }

    const collaboratorSubmit = async email => {

        setLoading(true)

        try{
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.post("/projects/collaborators", {email}, config)
            setCollaborator(data)
            setAlert({})
            
            
        }catch(error){
            setAlert({
                msg: error.response.data.msg,
                error: true
            })
            
        }
        setLoading(false)
    }

    const addCollaborator = async email => { 
    
        try {
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.post(`/projects/collaborators/${project._id}`, email, config)

           setAlert({
            msg: data.msg,
            error: false
           })
           setCollaborator({})

        setTimeout(()=>{
            setAlert({})
        },[3000])

        } catch (error) {
            setAlert({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalDeleteCollaborator = (collaborator) =>{
        setModalDeleteCollaborator(!modalDeleteCollaborator)
        setCollaborator(collaborator)
    }

    const deleteCollaborator = async () =>{
        try {
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.post(`/projects/delete-collaborator/${project._id}`, {id : collaborator._id} , config)

            const updatedProject = {...project}

            updatedProject.collaborators = updatedProject.collaborators.filter(collaboratorState => collaboratorState._id !== collaborator._id )
            setProject(updatedProject)

            setAlert({
                msg: data.msg,
                error: false
            })
            
            setCollaborator({})
            setModalDeleteCollaborator(false)

            setTimeout(()=>{
                setAlert({})
            },[3000])

        } catch (error) {
            console.log(error.response)
        }
        
    }


    const completeTask = async id =>{
        try {
            const token = localStorage.getItem("token")
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await axiosClient.post(`/task/status/${id}`, {} , config)
            
           

            setTask({})
            setAlert({})

            //SOCKET
            socket.emit("change status", data)


        } catch (error) {
            console.log(error.response)
        }
    }

    const handleSearcher = () =>{
        setSearcher(!searcher)
    }

    //SOCKET IO
    const submitProjectTasks = (task) =>{
        const updatedProject = {...project}
        updatedProject.tasks = [...updatedProject.tasks, task]
        setProject(updatedProject)
    }

    const deleteProjectTasks = (task) =>{
        const updatedProject = {...project}
        updatedProject.tasks = updatedProject.tasks.filter(taskState => taskState._id !== task._id)
        setProject(updatedProject)
    }

    const updateProjectTasks = (task) =>{
        const updatedProject = {...project}
        updatedProject.tasks = updatedProject.tasks.map(taskState => taskState._id === task._id ? task : taskState)
        setProject(updatedProject)
    }

    const changeStatusTask = (task) =>{
        const updatedProject = {...project}
        updatedProject.tasks = updatedProject.tasks.map(taskState => taskState._id = task._id ? task : taskState)
        setProject(updatedProject)
    }

    const logOutProjects = () =>{
        setProjects([])
        setProject({})
        setAlert({})
    }


    return(
        <ProjectsContext.Provider
        value={{
            projects,
            showAlert,
            alert,
            projectSubmit,
            getProject,
            deleteProject,
            project,
            loading,
            modalTask,
            handleModalTask,
            taskSubmit,
            handleModalEditTask,
            task,
            modalDeleteTask,
            handleModalDeleteTaks,
            deleteTask,
            collaboratorSubmit,
            collaborator,
            addCollaborator,
            handleModalDeleteCollaborator,
            modalDeleteCollaborator,
            deleteCollaborator,
            completeTask,
            handleSearcher,
            searcher,
            submitProjectTasks,
            deleteProjectTasks,
            updateProjectTasks,
            changeStatusTask,
            logOutProjects
        }}
        >
            {children}
        </ProjectsContext.Provider>
    )
}

export {ProjectsProvider} 

export default ProjectsContext