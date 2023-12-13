import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, isAdmin, isReport } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../css/Login.css";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [user, loading, error] = useAuthState(auth);

const navigate = useNavigate();

const navigateAdminUser = async () => {
    if(user && await isAdmin(user.uid)){
        
            // Checks if the user role is admin
            // alert("Its admin");
        navigate("/admin");
    }else if(user && user.uid && await isReport(user.uid)){
        // Checks if the user role is admin
        // alert("Its report user");
        navigate("/report");
    } else {
        // alert("You are just a user");
        navigate("/");
    }
}

useEffect(() => {
    if (loading) {
    // maybe trigger a loading screen
    return;
    }
    navigateAdminUser();
    // if (user) navigate("/dashboard");
}, [user, loading]);

return (
    <div className="login">
    <div className="login__container">
    {user ? (
        <>
            <Link to="/dashboard">
                <h1>
                INICIAR WEB APP
                </h1>
            </Link>
            <br/>
            <button
            className="logout__btn"
            onClick={() => auth.signOut()}
            >
            Logout
            </button>
        </>
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
);
}
export default Login;
