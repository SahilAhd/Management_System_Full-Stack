import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Login from "../assets/Login.png";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle Login Submission
 const handleLogin = async (event) => {
 event.preventDefault();

    try {
    const response = await fetch("http://localhost:5002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), //  Send login details to backend
      });

      console.log("RAW RESPONSE:", response);
      const data = await response.json();
      console.log("LOGIN RESPONSE:", data.user.role);
      if (response.ok) {
          console.log("✅ Data received:", data);

        localStorage.setItem("token", data.token); //  Store JWT securely
        localStorage.setItem("user", JSON.stringify(data.user)); //  Store user details
        if(data.user.role === "admin"){
          navigate("/Admin");
        }else{navigate("/Userp");}
         //  Redirect to User Page
      } else {
        alert(data.message); //Show error message if login fails
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-20% h-full">
        <img src={Login} alt="Login" className="h-full object-cover" />
      </div>

    <div className="w-3/6 flex items-center justify-center">
    <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login to Your Account</h2>

          
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don't have an account? <button className="text-blue-600 underline cursor-pointer"
            onClick={()=> navigate('/Signup')}>Signup</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;