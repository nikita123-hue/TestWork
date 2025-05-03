import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/auth";
import AuthForm from "../components/auth/AuthForm";
import "./AppPage.css"

function App() {
    const [activeForm, setActiveForm] = useState("login");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleAuth = async (data, isLogin) => {
        try {
            const authData = isLogin
                ? await login(data.username, data.password)
                : await register(
                    data.username,
                    data.email,
                    data.password,
                    data.phone, 
                    data.city 
                );

            localStorage.setItem("access", authData.access);
            localStorage.setItem("refresh", authData.refresh);
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.detail || "Authentication failed");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-tabs">
                    <button
                        className={`tab ${
                            activeForm === "login" ? "active" : ""
                        }`}
                        onClick={() => setActiveForm("login")}
                    >
                        Вход
                    </button>
                    <button
                        className={`tab ${
                            activeForm === "register" ? "active" : ""
                        }`}
                        onClick={() => setActiveForm("register")}
                    >
                        Регистрация
                    </button>
                </div>

                {error && <div className="alert error">{error}</div>}

                <AuthForm
                    type={activeForm}
                    onSubmit={handleAuth}
                    extraFields={
                        activeForm === "register"
                            ? [
                                {
                                    name: "phone",
                                    type: "tel",
                                    placeholder: "Номер телефона",
                                    required: true,
                                },
                                {
                                    name: "city",
                                    type: "text",
                                    placeholder: "Город",
                                    required: true,
                                },
                            ]
                            : []
                    }
                />
            </div>
        </div>
    );
}

export default App;
