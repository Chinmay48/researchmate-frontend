import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"

function ProtectedRoute() {
    const {isAuthenticated,isLoading} =useAuth();
    if(isLoading){
        return(<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-500" />
      </div>)
    }
    if(!isAuthenticated){
        return <Navigate to={"/login"} replace/>
    }
  return (
    <Outlet/>
  )
}

export default ProtectedRoute
