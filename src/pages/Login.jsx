import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, isAdmin, isReport } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../css/Login.css";
import Banner from "../components/Header";
import Footer from '../components/Footer';

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [user, loading, error] = useAuthState(auth);

const navigate = useNavigate();

return (
    <div>
            <div className="banner__container">
                <Banner />
            </div>
        <div className="login">
        <div className="login__container">
        {user ? (
            <div className="login__buttons">
                <Link to="/report">
                    <button>
                    Página de reportes
                    </button>
                </Link>
                <br/>
                <Link to="/">
                    <button>
                    Iniciar formulario
                    </button>
                </Link>
                <br/>
                <button
                onClick={() => auth.signOut()}
                >
                Logout
                </button>
            </div>
        ) : (
            <>
                <input
                type="text"
                className="login__textBox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail Address"
                />
                <input
                type="password"
                className="login__textBox"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                />
                <button
                className="login__btn"
                onClick={() => logInWithEmailAndPassword(email, password)}
                >
                Login
                </button>
                {/* <div>
                <Link to="/reset">Forgot Password</Link>
                </div> */}
            </>
        )}
        </div>
    </div>

    <div className="footer__container">
        <Footer />
    </div>
</div>

);
}
export default Login;
