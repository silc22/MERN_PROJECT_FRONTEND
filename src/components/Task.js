import { formatDate } from "../helpers/formatDate"
import useProjects from "../hooks/useProjects"
import useAdmin from "../hooks/useAdmin"

const Task = ({task}) => {
    
    const {handleModalEditTask, handleModalDeleteTaks, completeTask} = useProjects()

    const { name, description, priority, deliveryDate, status, _id} = task

    const admin  = useAdmin()


    return(
        <div className="border-b p-5 flex justify-between items-center">
            <div className="flex flex-col items-start">
                <p className=" mb-1 text-xl">{name}</p>
                <p className=" mb-1 text-sm text-gray-500 uppercase">{description}</p>
                <p className=" mb-1 text-sm">{formatDate(deliveryDate)}</p>
                <p className=" mb-1 text-gray-600">Priority: {priority}</p>
                { status && <p className="text-xs bg-green-600 capitalize p-1 rounded-lg text-white">Completed by: {task.completed.name} </p>}
            </div>
            <div className="flex flex-col lg:flex-row gap-2">

                {admin && (
                    <button
                    className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    onClick={()=>handleModalEditTask(task)}>
                        Edit
                    </button>
                )}
                
                

                <button
                    className={`${status ? "bg-sky-600" : "bg-gray-600"}  px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                    onClick={() =>completeTask(_id)}>
                    {status ? "Complete" : "Incomplete"}
                </button>

                {admin && ( 
                    <button
                    className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    onClick={()=>handleModalDeleteTaks(task)}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    )
}

export default Task