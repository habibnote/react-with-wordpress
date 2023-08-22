import { useParams } from "react-router-dom"
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ShowPost() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const siteUrl = "http://rootsite.local";

  useEffect(() => {
    axios.get(`${siteUrl}/wp-json/wp/v2/posts?author=${id}`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, [id]);

  return (
   <div>
      <div className="w-100 p-3 mb-3 text-center h2 bg-white">
         User Posts
      </div>
      {
         posts.map( post => (
            <div key={ post.id } className="card text-center w-75 m-auto mt-3">
               <div className="card-body">
                  <h5 className="card-title"> { post.title.rendered }</h5>
                  <p className="card-text" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
                  <a href="#" className="btn btn-primary">Go somewhere</a>
               </div>
               <div className="card-footer text-muted">
                  2 days ago
               </div>
            </div>
        ))
      }
      
 </div>
  )
}
