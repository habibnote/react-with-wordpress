import { useContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserProvider.jsx/UserProvider";
function Login() {
  // const [error, setError] = useState([]);
  // const [nonce, setNonce] = useState("");
  // const [isLoading, setIsLoading] = useState(true);

  // const [loggedIn, setLoggedIn] = useState(false);

  const data = {
    username: "",
    email: "",
    password: "",
    loggedIn: false,
    error: "",
  };
  const [inputData, setInputData] = useState(data);
  const navigate = useNavigate();

  const { userID, setUserID } = useContext(UserContext);
  const handleChange = (e) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const loginData = {
  //     username: inputData.username,
  //     password: inputData.password,
  //   };

  //   const siteUrl = "http://localhost/wordpress";

  //   axios
  //     .post(`${siteUrl}/wp-json/jwt-auth/v1/token`, loginData)
  //     .then((response) => {
  //       console.warn("loggedIn", response.data);
  //       if (undefined === response.data.token) {
  //         setInputData({
  //           ...inputData,
  //           error: response.data.message,
  //         });
  //         return;
  //       }
  //       const { token, user_nicename, user_email } = response.data;
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("userName", user_nicename);
  //       localStorage.setItem("user", JSON.stringify(response.data));
  //       setInputData({
  //         ...inputData,
  //         token: token,
  //         email: user_email,
  //         userNiceName: user_nicename,
  //         loggedIn: true,
  //       });
  //       navigate("/postform");
  //     })
  //     .catch((err) => {
  //       setInputData({
  //         ...inputData,
  //         error: err.response.data,
  //       });
  //     });

  //   if (!inputData.username || !inputData.email || !inputData.password) {
  //     alert("All Fields Are Required!");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const nonceResponse = await fetch(
        "http://localhost/wordpress/wp-json/custom-login-api/v1/nonce"
      );
      const nonceData = await nonceResponse.json();
      const nonceValue = nonceData.nonce_value;
      console.log("NONCE", nonceValue);
      if (!nonceValue) {
        console.error("Nonce not available");
        return;
      }

      const loginData = {
        username: inputData.username,
        password: inputData.password,
        nonce_value: nonceValue,
        nonce_action: "custom_login_nonce",
      };

      const siteUrl = "http://localhost/wordpress";

      const response = await axios.post(
        `${siteUrl}/wp-json/custom-login-api/v1/login`,
        loginData
      );

      if (response.data.success == true) {
        console.log("res", response);

        localStorage.setItem("nonce_value", nonceValue);
        localStorage.setItem("author_id", response.data.author_id);
        setUserID(response.data.author_id);
        navigate("/postform");
      }
      if (undefined === response.data.success) {
        setInputData({
          ...inputData,
          error: response.data.message,
        });
        return;
      }
    } catch (error) {
      console.error("Error:", error);
    }

    if (!inputData.username || !inputData.password) {
      alert("All Fields Are Required!");
    }

    console.log("from login", userID);
  };

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
