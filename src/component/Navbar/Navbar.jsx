import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-slate-400 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">My Website</div>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="text-white hover:text-blue-300">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-blue-300">
              submit Post
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-blue-300">
              Show post
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
