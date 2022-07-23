import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const Sidebar = () => {

    const { auth } = useAuth()

    return(
        <>
        <div>
           <aside className="w-auto px-5 py-10">
               <p className="text-xl front-bold">
                    ¡Hi {auth.name}!
               </p>

               <Link
               className="bg-sky-600 w-full p-3 text-white uppercase font-bold block mt-5 text-center rounded-lg"
               to="create-project">
                   New project
               </Link>
           </aside>
        </div>
        </>
    )
}

export default Sidebar