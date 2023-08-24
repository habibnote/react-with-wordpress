import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import UserContext from "../UserProvider.jsx/UserProvider";
const AllPost = () => {
  const [post, setUserPosts] = useState([]);
  const { userID } = useContext(UserContext);
  useEffect(() => {
    console.log("userContext from allpost", userID);
  }, [userID]);
  // const user = localStorage.getItem("user");
  useEffect(() => {
    if (userID) {
      axios
        .get(`http://localhost/wordpress/wp-json/wp/v2/posts?author=${userID}`)
        .then((response) => {
          setUserPosts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    }
  }, [userID]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <div className="grid grid-cols-3 gap-4">
        {post.map((post) => (
          <div key={post.id} className="bg-white shadow-md p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">
              {post.title.rendered}
            </h2>
            <div className="text-gray-600">{post.excerpt.rendered}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPost;
