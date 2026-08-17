import { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import "./Login.css";
import images from "../../utils/images";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../redux/slice/loginSlice";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/common/Toast";
import Button from "../../components/common/Button";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: email,
      password: password,
    };
    const response = await dispatch(userLogin(formData));
    if (response.type === "userLogin/fulfilled") {
      if (
        response.payload?.data?.accessToken &&
        response.payload?.data?.refreshToken
      ) {
        Cookies.set("auth_token", response.payload.data.accessToken);
        Cookies.set("refresh_token", response.payload.data.refreshToken);
      }
      showSuccessToast("Login successful! Welcome back.");
      navigate("/", { replace: true });
    } else {
      showErrorToast(response.payload?.message || error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-brand">
          <img src={images.logo} alt="Brand Logo" />
        </div>

        <div className="login-card">
          <div className="login-header">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label>Email address</label>
              <div className="input-group">
                <Mail size={18} className="left-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>

              <div className="input-group">
                <Lock size={18} className="left-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* <div className="label-row">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div> */}
            </div>

            {/* Submit */}
            <Button type="submit" variant="primary" loading={loading} fullWidth className="login-submit-btn">
              <span className="btn-text">Sign in</span>
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
