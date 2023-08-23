import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserProvider.jsx/UserProvider";

const Navbar = () => {
  const { userID, setUserID } = useContext(UserContext);
  console.log("logout id", userID);
  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUserID("");
    navigate("/login");
  };
  return (
    <nav className="bg-slate-400 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">My Website</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/">Home </Link>
          </li>
          <li>
            <Link to="/postform">Post </Link>
          </li>

          <li>
            <Link to="/allpost">Allpost</Link>
          </li>

          {userID ? (
            <li>
              <Link onClick={handlelogout}>Logout</Link>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
