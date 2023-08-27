import React, { useContext, useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import UserContext from "../UserProvider.jsx/UserProvider";
const PostForm = () => {
  // const [title, setTitle] = useState("");
  // const [Content, setContent] = useState("");
  // const [email, setEmail] = useState("");
  const [nonce, setNonce] = useState(""); // State to store nonce

  // useEffect(() => {
  //   // Fetch nonce from cookies
  //   const customNonce = Cookies.get("custom_nonce");
  //   setNonce(customNonce);
  //   console.log("nonce in post", nonce);
  // }, []);
  const { userID, setUserID } = useContext(UserContext);

  const data = {
    post_title: "",
    post_content: "",
    author_id: "",
    token: "",
    loader: false,
  };
  const [inputData, setInputData] = useState(data);

  const handleChange = (event) => {
    setInputData({
      ...inputData,
      [event.target.name]: event.target.value,
    });
  };
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   console.log("post", inputData);

  //   // const siteUrl = "http://localhost/wordpress";
  //   const token = localStorage.getItem("token");
  //   // const apiUrl = 'http://localhost/wordpress/wp-json/custom-post-submitter/v1/submit-post'; // Adjust the URL

  //   const apiUrl =
  //     "http://localhost/wordpress/wp-json/custom-post-submitter/v1/submit-post";

  //   const newPost = {
  //     title: inputData.title,
  //     content: inputData.content,
  //   };
  //   const statusChangedPost = { ...newPost, status: "publish" };
  //   // .post(`${siteUrl}/wp-json/wp/v2/posts`, statusChangedPost, {
  //   axios
  //     .post(apiUrl, statusChangedPost, {
  //       // headers: {
  //       //   Authorization: `Bearer ${token}`,
  //       //   "Content-Type": "application/json",
  //       // },
  //     })
  //     .then((res) => {
  //       setInputData((prevState) => ({
  //         ...prevState,
  //         loader: true,
  //       }));
  //       setUserID(res.data.author); // Set userID in context
  //       console.log("res", res);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nonce = localStorage.getItem("nonce_value"); // Retrieve nonce from localStorage
    const authorId = localStorage.getItem("author_id");

    const apiUrl =
      "http://localhost/wordpress/wp-json/custom-post/v1/create-post";

    const newPost = {
      post_title: inputData.post_title,
      post_content: inputData.post_content,
      nonce_value: nonce,
      nonce_action: "custom_login_nonce",
      author_id: authorId,
    };
    console.log("new post", newPost);

    axios
      .post(apiUrl, newPost, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        setInputData((prevState) => ({
          ...prevState,
          loader: true,
        }));
        setUserID(res.data.author);
        console.log("res from submit", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
    console.log("userContextId is set", userID);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="postName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Post Title
          </label>

          <input
            type="text"
            placeholder="Post Title"
            name="post_title"
            className="w-full px-3 py-2 border rounded-md"
            value={inputData.post_title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="postContent"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Post Content
          </label>
          <textarea
            id="content"
            name="post_content"
            className="w-full px-3 py-2 border rounded-md"
            rows="4"
            value={inputData.post_content}
            onChange={handleChange}
            // onChange={(e) => setContent(e.target.value)
            required
          ></textarea>
        </div>
        {/* <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded-md"
            // onChange={(e) => setEmail(e.target.value)}
            value={inputData.email}
            onChange={handleChange}
            required
          />
        </div> */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
