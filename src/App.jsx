import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const handleClick = () => {};
  return (
    <>
      <div className="flex justify-center items-center h-screen  bg-slate-400">
        <div className="w-full max-w-md ">
          <form
            className="shadow-md rounded px-8 py-14 bg-slate-300"
            onSubmit={handleClick}
          >
            <div className="mb-4">
              <h3 className="text-center">Welcome to Login!</h3>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md"
                name="email"
                type="text"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md "
                type="password"
                name="password"
                placeholder="Enter your password"
              />
            </div>

            <input className="btn btn-primary" type="submit" value="submit" />
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
