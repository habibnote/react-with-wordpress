import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const user = localStorage.getItem('user');  

    useEffect(()=>{
        const currenUser = JSON.parse(user);
        const UserID = currenUser.profile.id;
        let url = "http://localhost:10005/wp-json/wp/v2/posts?author=";
        axios.get(url+UserID).then((res)=>{
            setPosts(res.data);
        });
    }, [user] );

    return (
        <>
            <Row className="lat-post-wrapper">
                <h1 className="lat-post-tite">Latest Posts</h1>
                <Col>
                    {
                        Object.keys(posts).length ? posts.map((post)=>{
                            const featuredImg = post.featured_src ? post.featured_src : "https://via.placeholder.com/500";
                            return (
                                <div key={post.id} className="single-post">
                                    <Row>
                                        <Col lg={4}>
                                            <Link to={`/posts/${post.id}`}>
                                                <img src={featuredImg} alt={post.title.rendered}/>
                                            </Link>
                                        </Col>
                                        <Col lg={8}>
                                            <Link to={`/posts/${post.id}`}>
                                                <h2>{post.title.rendered}</h2>
                                                <p dangerouslySetInnerHTML={{__html:post.excerpt.rendered}}></p>
                                            </Link>
                                        </Col>
                                    </Row>

                                </div>
                            )
                        }) : 'Loding...'
                    }
                </Col>
            </Row>
        </>
    )
}

export default Posts; 