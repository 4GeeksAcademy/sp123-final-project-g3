import { useNavigate } from "react-router-dom";
import UseLogOut from "../api/logout.js";

export const LogOut = () => {
    const navigate = useNavigate()
    const logOut = UseLogOut()
    return (
        <>
            <button className="btn btn-primary" onClick={LogOut}
            >Log out</button>
        </>
    );
};