import axios from 'axios';
import { useState } from 'react';
const InsertPost = () => {
   const data = {
      title: '',
      content: '',
      userID: '',
      token: ''
    };
    const [ inputData, setInputData ] = useState( data );
    const siteUrl = "http://rootsite.local";
    const token = localStorage.getItem( 'token' );
  
    const handleChange = (e) => {
      setInputData({
        ...inputData,
        [e.target.name]: e.target.value,
      });
    };
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if( ! inputData.title || ! inputData.content || ! inputData.email ) {
        alert ("All Fields Are Required!");
      }
      else {
         const newPost = {
            title: inputData.title,
            content: inputData.content,
          };
          const statusChangedPost = { ...newPost, status: 'publish' };
      
         axios.post(`${ siteUrl }/wp-json/wp/v2/posts` , statusChangedPost, {
            headers : {
               "Authorization" : `Bearer ${ token }`,
               'Content-Type': 'application/json',
            }
         })
         .then(( res ) => {
            console.log ( "res" , res);
         })
         .catch(( err ) => {
            console.log ( "err" , err);
         })
      }
    };
   return (
      <div>
         <form action="" className="container" onSubmit = { handleSubmit }>
         <div className="header">
            <h2>Submit Your Post</h2>
         </div>
         <div>
            <input
               type = "text"
               placeholder = "Post Title"
               name = "title"
               value = { inputData.title }
               onChange = { handleChange }
            />
         </div>
         <div>
            <textarea 
               name="content" 
               type="text" 
               placeholder="Post Content" 
               cols="30" 
               rows="10" 
               value={ inputData.content } 
               onChange={ handleChange } >
            </textarea> 
         </div>
         <div>
               <input
               type="email"
               placeholder="Enter Email"
               name="email"
               value={ inputData.email }
               onChange={ handleChange }
            />
         </div>
         <div className="btn-div">
            <button type="submit">Save Post</button>
         </div>
         </form>
    </div>
   )
}
export default InsertPost;