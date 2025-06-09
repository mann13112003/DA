import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import {register} from '../../services/api'
import { AuthContext } from "../../context/AuthContext";
import './Login.css';
import { FaUser, FaLock, FaEnvelope, FaGoogle, FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

const Login = () => {
    const {log_in} = useContext(AuthContext);
    const [isActive, setIsActive] = useState(false);
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });
    const [registerForm, setRegisterForm] = useState({
        email: '',
        password: '',
        username:''
    });
    const handleLoginChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value,
        })
    };
  const handleRegisterChange = (e) => {
    setRegisterForm({
        ...registerForm,
        [e.target.name]: e.target.value,
    })
  }
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try{
        await log_in(loginForm.email, loginForm.password);
    }catch(error){
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        console.error("Lỗi khi đăng nhập:",error)
    }
  }
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await register(registerForm);
        if(response.data.errCode === 0){
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            setIsActive(false);
        }else{
            toast.error(response.data.errMessage);
        }
    }catch(error){
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        console.error("Lỗi đăng ký:",error)
    }
  }

  return (
      <div className={`container ${isActive ? "active" : ""}`}>
          {/* Login Form */}
          <div className="form-box login">
              <form onSubmit={handleLoginSubmit}>
                  <h1>Login</h1>
                  <div className="input-box">
                      <input 
                      type="email" 
                      placeholder="Email" 
                      name="email"  
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      required 
                      />
                      <i><FaEnvelope className="icon" /></i>
                  </div>
                  <div className="input-box">
                      <input 
                      type="password" 
                      placeholder="Password" 
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required 
                      />
                      <i><FaLock className="icon" /></i>
                  </div>
                  <div className="forgot-link">
                      <a href="#">Forgot Password?</a>
                  </div>
                  <button type="submit" className="btn">Login</button>
                  <p>or login with social platforms</p>
                  <div className="social-icons">
                      <a href="#"><FaGoogle /></a>
                      <a href="#"><FaFacebook /></a>
                      <a href="#"><FaGithub /></a>
                      <a href="#"><FaLinkedin /></a>
                  </div>
              </form>
          </div>
          
          {/* Register Form */}
          <div className="form-box register">
              <form onSubmit={handleRegisterSubmit}>
                  <h1>Registration</h1>
                  <div className="input-box">
                      <input 
                      type="email" 
                      placeholder="Email" 
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      required 
                      />
                      <i><FaEnvelope className="icon" /></i>
                  </div>
                  <div className="input-box">
                      <input 
                      type="password" 
                      placeholder="Password" 
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      required 
                      />
                      <i><FaLock className="icon" /></i>
                  </div>
                  <div className="input-box">
                      <input 
                      type="text" 
                      placeholder="Username" 
                      name="username"
                      value={registerForm.username}
                      onChange={handleRegisterChange}
                      required />
                      <i><FaUser className="icon" /></i>
                  </div>
                  <button type="submit" className="btn">Register</button>
                  <p>or register with social platforms</p>
                  <div className="social-icons">
                      <a href="#"><FaGoogle /></a>
                      <a href="#"><FaFacebook /></a>
                      <a href="#"><FaGithub /></a>
                      <a href="#"><FaLinkedin /></a>
                  </div>
              </form>
          </div>

          {/* Toggle Panel */}
          <div className="toggle-box">
              <div className="toggle-panel toggle-left">
                  <h1>Hello, Welcome!</h1>
                  <p>Don't have an account?</p>
                  <button className="btn register-btn" onClick={() => setIsActive(true)}>Register</button>
              </div>
              <div className="toggle-panel toggle-right">
                  <h1>Welcome Back!</h1>
                  <p>Already have an account?</p>
                  <button className="btn login-btn" onClick={() => setIsActive(false)}>Login</button>
              </div>
          </div>
      </div>
  );
};


export default Login;
