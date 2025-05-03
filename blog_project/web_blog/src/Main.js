import {Routes, Route } from "react-router-dom";
import App from "./pages/AppPage";
import Home from "./pages/HomePage";
import PostComments from "./pages/PostCommentsPage"

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
