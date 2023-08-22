import { useState } from "react";
import axios from "axios";

import { useEffect } from "react";
function Login() {
  const [error, setError] = useState([]);
  const [nonce, setNonce] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchNonce();
  }, []);

  const fetchNonce = async () => {
    try {
      const response = await fetch(
        "http://localhost/wordpress/wp-json/custom-auth-api/v1/nonce"
      );
      const data = await response.json();

      setNonce(data.nonce);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching nonce:", error);
      setIsLoading(false);
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log(email, password);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen  bg-slate-400">
        <div className="w-full max-w-md ">
          <h3 className="text-center">Welcome !</h3>
          <form
            className="shadow-md rounded px-8 py-14 bg-slate-300"
            onSubmit={handleClick}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md "
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

            <div className="flex items-center justify-between">
              {/* <button
                className="bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              > */}
              <input className="btn btn-primary" type="submit" value="submit" />
              {/* </button> */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
