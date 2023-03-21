import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../config/AuthContext";
import { auth } from "../config/Firebase.jsx";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = UserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>

      <div className="form-group">
        <label for="email">Email Address</label>
        <br />
        <input
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      </div>

      <div className="form-group">
        <label for="password">Password</label>
        <br />
        <input
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>

      <button>Sign In</button>

      <p>
        Don't have an account? <Link to="/signup">Sign up.</Link>
      </p>
    </form>
  );
};

export default SignIn;