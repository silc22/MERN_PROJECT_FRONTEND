import { Link } from "react-router-dom"
import useProjects from "../hooks/useProjects"
import useAuth from "../hooks/useAuth"
import Searcher from "./Searcher"

const Header = () => {

    const { handleSearcher, logOutProjects } = useProjects()
    const { logOutAuth } = useAuth()

    const handleLogOut = () =>{
        logOutProjects()
        logOutAuth()
        localStorage.removeItem("token")
    }

    return(
        <>
        <header
        className="px-4 py-5 bg-white border-b"
        >
            <div className="md:flex md:justify-between">
                <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0 uppercase"
                >MERN - project app
                </h2>


                <div className="flex flex-col md:flex-row items-center gap-4">
                    <button
                    type="button"
                    className="font-bold uppercase"
                    onClick={handleSearcher}>
                        Search project
                    </button>
                    <Link
                    to="/projects"
                    className="font-bold uppercase"
                    >Projects
                    </Link>

                    <button
                    type="button"
                    className="text-white bg-sky-600 rounded-md uppercase font-bold px-2"
                    onClick={handleLogOut}>
                        Log out
                    </button>

                    <Searcher/>
                </div>
           
            </div>
        </header>
        </>
    )
}

export default Header