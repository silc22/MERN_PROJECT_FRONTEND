import { useEffect } from "react"
import useProjects from "../hooks/useProjects"
import ProjectsPreview from "../components/ProjectPreview"
import Alert from "../components/Alert"

const Projects = () =>{

    const { projects, alert } = useProjects()




    const { msg } = alert

    return(
        <>
            <h1 className="text-4xl font-black">Proyects</h1>

            {msg && <Alert alert={alert}/>}

            <div className="bg-white my-2">
                {
                    projects.length ? 
                    projects.map(project => (
                        <ProjectsPreview 
                        key={project._id}
                        project={project}
                        />
                    ))
                    :
                    <p className="text-center text-gray-600 uppercase p-2">No projects created yet</p>
                }
            </div>
        </>
    )
}

export default Projects
