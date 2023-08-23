import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./component/Main/Main.jsx";
import Home from "./component/Home/Home.jsx";
import Login from "./component/Login/Login.jsx";
import PostForm from "./component/PostFrom/PostForm.jsx";
import AllPost from "./component/AllPost/AllPost.jsx";

import { UserProvider } from "./component/UserProvider.jsx/UserProvider.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/postform",
        element: <PostForm></PostForm>,
      },
      {
        path: "/allpost",
        element: <AllPost></AllPost>,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      {" "}
      <RouterProvider router={router}> </RouterProvider>
    </UserProvider>
  </React.StrictMode>
);
