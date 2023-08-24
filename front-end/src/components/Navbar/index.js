import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const NavbarMain = () => {
    const auth = localStorage.getItem('user');
    // const user = JSON.parse(auth);

    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem( 'user' );
        navigate("/");
    }
    return (
        <>  
            <Row>
                <header className="header-wrapper d-flex justify-content-between">
                    <div className="logo-area">
                        <h1><Link to="/">Site Name</Link></h1>
                    </div>
                    <div className="navigation">
                        <ul className="d-flex justify-content-center">
                            {! auth ? (
                                <>
                                    <li className="p-3"><Link to="/login">Login</Link></li>
                                </>
                            ) : (
                                <>
                                    <li className="p-3"><Link to="/posts">Posts</Link></li>
                                    <li className="p-3"><Link to="/new-post">New Post</Link></li>
                                    <li className="p-3"><Link onClick = { handleLogOut } to="/">Logout</Link></li>
                                </>
                            )}

                        </ul>
                    </div>
                </header>
            </Row>
        </>
    );
}

export default NavbarMain;
