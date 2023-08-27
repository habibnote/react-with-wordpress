import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const InsertPost = () => {
   const data = {
      post_title: '',
      post_content: '',
      nonce_value: '',
      nonce_action: '',
      author_id: '',
      token: '',
      loader: false,
    };
    const [ inputData, setInputData ] = useState( data );
    const siteUrl = "http://rootsite.local";
    const nonce_value = localStorage.getItem( 'nonce_value' );
    const nonce_action = localStorage.getItem( 'nonce_action' );
    const navigate = useNavigate();
      
    const handleChange = (e) => {
      setInputData({
        ...inputData,
        [e.target.name]: e.target.value,
      });
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      if( ! inputData.post_title || ! inputData.post_content ) {
        Swal.fire({
         title: 'Warning',
         text: 'All Fields Are Required!',
         icon: 'warning', // success, error, warning, info
       });
      }
      else {
         const userID = localStorage.getItem( 'author_id' );
         const newPost = {
            post_title: inputData.post_title,
            post_content: inputData.post_content,
            nonce_action: nonce_action,
            nonce_value: nonce_value,
            author_id: userID
          };
       
         axios.post(`${ siteUrl }/wp-json/custom-post/v1/create-post` , newPost , {
            headers : {
               'Content-Type': 'application/json',
            }
         })
         .then(( res ) => {
            setInputData( {
               ...inputData,
               post_title: inputData.title,
               post_contentcontent: inputData.content,
               nonce_action: nonce_action,
               nonce_value: nonce_value,
               author_id: userID,
               loader: true
            } )
         })
         .catch(( err ) => {
            console.log ( "err" , err);
         })
      }
    };
   if ( inputData.loader ){
      Swal.fire({
         title: 'Success!',
         text: 'Email Has Been Sent Successfully',
         icon: 'success', // success, error, warning, info
       });
      return navigate(`/post/${inputData.author_id}`);
   } else {
      return (
         <div>
            <form action="" className="contain" onSubmit = { handleSubmit }>
            <div className="header">
               <h2>Create New Post</h2>
            </div>
            <div>
               <input
                  type = "text"
                  placeholder = "Post Title"
                  name = "post_title"
                  value = { inputData.post_title }
                  onChange = { handleChange }
               />
            </div>
            <div>
               <textarea 
                  name="post_content" 
                  type="text" 
                  placeholder="Post Content" 
                  cols="30" 
                  rows="10" 
                  value={ inputData.post_content } 
                  onChange={ handleChange } >
               </textarea> 
            </div>
            <div className="btn-div">
               <button type="submit" >Save Post</button>
            </div>
            </form>
       </div>
      )
   }
   
}
export default InsertPost;