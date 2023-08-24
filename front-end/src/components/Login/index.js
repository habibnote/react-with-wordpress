import { Col, Row } from "react-bootstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = () =>{

    const navigate = useNavigate();

    const formik = useFormik({
        // Initial values
        initialValues: {
            email: '',
            password: '',
        },

        // Validation Schema
        validationSchema: Yup.object({
            email: Yup.string().required().email(),
            password: Yup.string().required().min(4),
        }),

        // On Submit
        onSubmit: (data) => {
            const {email, password} = data;
            axios.post('http://localhost:10005/wp-json/jwt-auth/v1/token', {
                "username": email,
                "password": password
            }).then((res)=>{
                
                if(res.status === 200 && res.statusText === 'OK'){
                    localStorage.setItem('user', JSON.stringify(res.data));
                    navigate("/");
                }
            }).catch((err)=>{
                console.log('error', err.message);
            });
        }
    });

    return (
        <>
            <Row>
                <Col>
                    <div className="login-page-wrapper">
                        <h1 className="text-center mb-4">Login</h1>
                        <form onSubmit={ formik.handleSubmit } className="login-form" >
                            <input 
                                className="mb-4"
                                type="text" 
                                placeholder="Email Address" 
                                name="email" 
                                value={ formik.values.email } 
                                onChange={ formik.handleChange }
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                            <button type="submit">Login</button>
                        </form> 
                    </div>
                </Col>
            </Row>
        </>
    );
}
export default Login;