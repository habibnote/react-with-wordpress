import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import UserContext from "../UserProvider.jsx/UserProvider";
const AllPost = () => {
  const [post, setUserPosts] = useState([]);
  // const { userID } = useContext(UserContext);
  // useEffect(() => {
  //   console.log("userContext from allpost", userID);
  // }, [userID]);
  // const custom_nonce = localStorage.getItem("custom_nonce");

  const author_id = localStorage.getItem("author_id");
  console.log("all author id", author_id);
  useEffect(() => {
    if (author_id) {
      //  .get(`http://localhost/wordpress/wp-json/wp/v2/posts?author=${userID}`)
      axios;
      axios
        .get(
          `http://localhost/wordpress/wp-json/custom-rest-get-plugin/v1/get-posts/${author_id}`
        )
        .then((response) => {
          console.log("get", response);
          setUserPosts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    }
  }, [author_id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <div className="grid grid-cols-3 gap-4">
        {post.lenght === 0 ? (
          <p>Loading...</p>
        ) : (
          post.map((post) => (
            <div key={post.id} className="bg-white shadow-md p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
              <h2 className="text-lg font-semibold mb-2">{post.content}</h2>
              {/* <div className="text-gray-600">{post.excerpt}</div> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllPost;
