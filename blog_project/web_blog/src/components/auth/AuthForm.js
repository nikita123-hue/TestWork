import { useState } from "react";
import "./AuthForm.css";

const AuthForm = ({ type, onSubmit }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        city: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (type === "register") {
            if (formData.password !== formData.confirmPassword) {
                setError("Пароли не совпадают");
                return;
            }
            if (formData.password.length < 8) {
                setError("Пароль должен содержать минимум 8 символов");
                return;
            }
        }

        onSubmit(formData, type === "login");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    return (
        <form onSubmit={handleSubmit} className="authForm">
            {error && <div className="error">{error}</div>}

            <input
                name="username"
                type="text"
                placeholder="Имя пользователя"
                value={formData.username}
                onChange={handleChange}
                required
            />

            {type === "register" && (
                <>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="phone"
                        type="tel"
                        placeholder="Номер телефона"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="city"
                        type="text"
                        placeholder="Город"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </>
            )}

            <input
                name="password"
                type="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                required
            />

            {type === "register" && (
                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Подтвердите пароль"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            )}

            <button type="submit">
                {type === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
        </form>
    );
};

export default AuthForm;
