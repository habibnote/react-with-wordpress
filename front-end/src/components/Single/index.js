import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Single = () => {
    const { id } = useParams();
    const [post, setPost] = useState({});

    useEffect(()=>{
        let url = "http://localhost:10005/wp-json/wp/v2/posts/"+id;
        axios.get(url).then(res => {
            console.log('res', res);
            setPost(res.data);
        }).catch(err => {
            console.log('error:', err.message);
        });
    }, [id]);
    return (
        <>
            {
                Object.keys(post).length ? (
                    <Row>
                        <Col>
                            <div className="single-post-wrapper">
                                <h1>
                                    {post.title.rendered}
                                </h1>
                                <div>
                                    <img src={post.featured_src} alt={post.title.rendered}/>
                                </div>

                                <div dangerouslySetInnerHTML={{__html:post.content.rendered}}></div>
                            </div>
                        </Col>
                    </Row>
                ) : 'Loading...'
            }
            {/* Single Posts {id} */}
        </>
    )
}

export default Single;