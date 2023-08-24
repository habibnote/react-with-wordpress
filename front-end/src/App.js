import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Posts from './components/Posts';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import NavbarMain from './components/Navbar';
import Login from './components/Login';
import AddPost from './components/AddPost';
import Single from './components/Single';


function App() {
  return (
    <>
      <NavbarMain/>
      <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/posts" element={<Posts/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/new-post" element={<AddPost/>} />
          <Route path="/posts/:id" element={<Single/>} />
          
      </Routes>
    </>
  );
}

export default App;
