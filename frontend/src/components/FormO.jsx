import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Form() {
  const data = {
    username: '',
    author_id : '',
    userNiceName: '',
    password: '',
    nonce_action: '',
    nonce_value: '',
    loggedIn: false,
    error: '',
    success: false,
  };
  const [ inputData, setInputData ] = useState( data );
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const siteUrl = "http://rootsite.local";

    axios.get( `${siteUrl}/wp-json/custom-login-api/v1/nonce`)
      .then( response => {    
        const { nonce_action, nonce_value ,user_email ,user_nicename } = response.data;
        localStorage.setItem( "nonce_action" , nonce_action );
        localStorage.setItem( "nonce_value" , nonce_value );

        setInputData({
          ...inputData,
          nonce_action: nonce_action,
          nonce_value: nonce_value,
          email : user_email,
          userNiceName : user_nicename
        })

        const finalData = {
          username : inputData.username,
          password: inputData.password,
          nonce_action: inputData.nonce_action,
          nonce_value : inputData.nonce_value
        }
        axios.post( `${siteUrl}/wp-json/custom-login-api/v1/login` , finalData)
        .then(response => {
          console.log(response);
          const nonce_action = localStorage.getItem( "nonce_action" );
          const nonce_value = localStorage.getItem( "nonce_value" );
          const author_ID = response.data.author_id;
          const author_id = localStorage.setItem( "author_id" , author_ID );
            setInputData( {
              ...inputData,
              nonce_action: nonce_action,
              nonce_value : nonce_value,
              success: response.data.success,
              author_id: author_id,
              loggedIn : true
            } )
            
        }).catch(err => {
          console.log(err);
        })
      }).catch(err => {
        setInputData({
          ...inputData,
          error : err.response.data
        })
        if (err.response.status !== 200) {
          Swal.fire({
            title: 'Unauthorized',
            text : "You're not authorized!",
            icon : 'warning', // success, error, warning, info
          });
        }
      })
        
      
      

    if( ! inputData.username || ! inputData.password ) {
      Swal.fire({
        title: 'Warning',
        text : 'All Fields Are Required!',
        icon : 'warning', // success, error, warning, info
      });
    }
  };
  
  
  if ( inputData.success ){
    return navigate("/post");
  } else {
    return (
      <div>
        <form action="" className="contain" onSubmit={ handleSubmit }>
          <div className="header">
            <h2>Login Form</h2>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter Your Username"
              name="username"
              value={inputData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={inputData.password}
              onChange={handleChange}
            />
          </div>
          <div className="btn-div">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
