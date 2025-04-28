import { useState } from "react";
import { login, register } from "./api/auth";
import "./App.css";

function App() {
    const [activeForm, setActiveForm] = useState("signin");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(formData.username, formData.password);
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
        } catch (err) {
          console.log(err)
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
          console.log("Пароли не совпадают")
          return;
        }
        try {
            const data = await register(
                formData.username,
                formData.email,
                formData.password
            );
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
        } catch (err) {
          console.log(err)
        }
    };

    return (
        <div>
            <div class="auth-box">
                <div className="toggle-buttons">
                    <button
                        className={activeForm === "signin" ? "active" : ""}
                        onClick={() => setActiveForm("signin")}
                    >
                        Вход
                    </button>
                    <button
                        className={activeForm === "signup" ? "active" : ""}
                        onClick={() => setActiveForm("signup")}
                    >
                        Регистрация
                    </button>
                </div>

                <div class="form-container">
                    <form
                        className={`form sign-in ${
                            activeForm === "signin" ? "active" : ""
                        }`}
                        id="auth-form"
                        onSubmit={handleLogin}
                    >
                        <h2 class="form-title">Вход в аккаунт</h2>
                        <label class="input-group">
                            <span class="input-label">Имя пользователя</span>
                            <input
                                type="text"
                                class="form-input"
                                id="username"
                                onChange={handleChange}
                                value={formData.username}
                                required
                            />
                        </label>
                        <label class="input-group">
                            <span class="input-label">Пароль</span>
                            <input
                                type="password"
                                class="form-input"
                                id="password"
                                onChange={handleChange}
                                value={formData.password}
                                required
                            />
                        </label>
                        <button type="submit" class="submit-btn">
                            Войти
                        </button>
                    </form>

                    <form
                        className={`form sign-up ${
                            activeForm === "signup" ? "active" : ""
                        }`}
                        id="register-form"
                        onSubmit={handleRegister}
                    >
                        <h2 class="form-title">Создать аккаунт</h2>
                        <label class="input-group">
                            <span class="input-label">Имя пользователя</span>
                            <input
                                type="text"
                                class="form-input"
                                id="username"
                                onChange={handleChange}
                                value={formData.username}
                                required
                            />
                        </label>
                        <label class="input-group">
                            <span class="input-label">Email</span>
                            <input
                                type="email"
                                class="form-input"
                                id="email"
                                onChange={handleChange}
                                value={formData.email}
                                required
                            />
                        </label>
                        <label class="input-group">
                            <span class="input-label">Пароль</span>
                            <input
                                type="password"
                                class="form-input"
                                id="password"
                                onChange={handleChange}
                                value={formData.password}
                                required
                            />
                        </label>
                        <label class="input-group">
                            <span class="input-label">Подтвердите пароль</span>
                            <input
                                type="password"
                                class="form-input"
                                id="confirmPassword"
                                onChange={handleChange}
                                value={formData.confirmPassword}
                                required
                            />
                        </label>
                        <button type="submit" class="submit-btn" id="sub-reg">
                            Зарегистрироваться
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
