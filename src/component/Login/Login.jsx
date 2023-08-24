import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
  const [error, setError] = useState([]);
  // const [nonce, setNonce] = useState("");
  // const [isLoading, setIsLoading] = useState(true);

  const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(() => {
  //   fetchNonce();
  // }, []);

  // const fetchNonce = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost/wordpress/wp-json/custom-auth-api/v1/nonce"
  //     );
  //     const data = await response.json();
  //     console.log("nonce", data);
  //     Cookies.set("custom_nonce", data.nonce);
  //     setNonce(data.nonce);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching nonce:", error);
  //     setIsLoading(false);
  //   }
  // };

  // const handleClick = async (event) => {
  //   event.preventDefault();
  //   const form = event.target;
  //   const email = form.email.value;
  //   const password = form.password.value;

  //   try {
  //     console.log("Sending request with nonce:", nonce);
  //     const response = await axios.post(
  //       "http://localhost/wordpress/wp-json/custom-auth-api/v1/login",
  //       {
  //         username: email,
  //         password: password,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "X-WP-Nonce": nonce,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       console.log("Auth successful");
  //       console.log(email, password);
  //     } else {
  //       setError("Auth failed");
  //     }
  //   } catch (error) {
  //     console.error("Error during POST request:", error);
  //     setError("An error occurred during authentication");
  //   }
  // };

  ////////////////jwt

  const data = {
    username: "",
    email: "",
    password: "",
    loggedIn: false,
    error: "",
  };
  const [inputData, setInputData] = useState(data);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const loginData = {
      username: inputData.username,
      password: inputData.password,
    };

    const siteUrl = "http://localhost/wordpress";

    axios
      .post(`${siteUrl}/wp-json/jwt-auth/v1/token`, loginData)
      .then((response) => {
        console.warn("loggedIn", response.data);
        if (undefined === response.data.token) {
          setInputData({
            ...inputData,
            error: response.data.message,
          });
          return;
        }
        const { token, user_nicename, user_email } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user_nicename);
        localStorage.setItem("user", JSON.stringify(response.data));
        setInputData({
          ...inputData,
          token: token,
          email: user_email,
          userNiceName: user_nicename,
          loggedIn: true,
        });
        navigate("/postform");
      })
      .catch((err) => {
        setInputData({
          ...inputData,
          error: err.response.data,
        });
      });

    if (!inputData.username || !inputData.email || !inputData.password) {
      alert("All Fields Are Required!");
    }
  };
  // };
  return (
    <>
      <div className="flex justify-center items-center h-screen  bg-slate-400">
        <div className="w-full max-w-md ">
          <h3 className="text-center">Welcome !</h3>
          <form
            className="shadow-md rounded px-8 py-14 bg-slate-300"
            // onSubmit={handleClick}
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                UserName
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md "
                name="username"
                type="text"
                placeholder="Enter your username"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md "
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
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
                onChange={handleChange}
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
