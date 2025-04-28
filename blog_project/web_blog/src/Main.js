import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import PostComments from "./PostComments"

function Main() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/home" element={<Home />} />
            <Route path="/posts/:postId/comments" element={<PostComments />} />
        </Routes>
    );
}

export default Main;
