import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
    const user = localStorage.getItem('user');  
    const navigate = useNavigate();

    const formik = useFormik({
        // Initial values
        initialValues: {
            title: '',            
            content: '',
        },

        // Vlidations
        validationSchema: Yup.object({
            title: Yup.string().required(),
            content: Yup.string().required(),       
        }),

        // Submit
        onSubmit: (data) => {
            const { token } = JSON.parse(user);
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const post = {
                ...data,
                status: 'publish'
            }
            
            const url = "http://localhost:10005/wp-json/wp/v2/posts";

            axios.post(url, post, {
                headers: headers
            }
            ).then((res) => {
                console.log('res', res);
                console.log(res.status);
                if(res.status === 201 && res.statusText === "Created"){
                    alert("Congratulation Post has been created");
                    navigate("/posts");
                }
                // alert(res.data.title);
            }).catch((err)=>{
                // console.log('err', err.message)
            })

            console.log('data', data);
        }
    });

    // console.log('formik.values', formik.values);
    // console.log('formik.errors', formik.errors);

    return (
        <>
            <Row>
                <Col>
                    <div className='login-page-wrapper'>
                        <h1 className='mb-5'>Create a New Post</h1>
                        <form onSubmit={ formik.handleSubmit } className="login-form" >
                            <label>Post Title</label>
                            <input 
                                id="post-title"
                                type="text"
                                placeholder="Enter post title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}

                            />
                            <label className='mt-4' htmlFor="post-content">Post Content </label>
                            <textarea
                                name="content"
                                placeholder="Enter post content"
                                onChange={formik.handleChange}
                                value={formik.values.content}
                            ></textarea>
                            <input type='submit' value='Create Post' />
                        </form> 
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default AddPost;