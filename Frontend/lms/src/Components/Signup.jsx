
import '../App.css';
import SignUp from '../assets/sign-up.png';
import  { useState } from "react";
import {useNavigate } from 'react-router-dom';

const Signup = () =>{
 // Initialize State to Hold Form Data
 const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    permanentadd: "",
    Pincode: "",
    contactnum: "",
    password: "",
     role: "", // Default role
  });

  //  Handle Input Changes
  const handleChange = (e) => {
    console.log("Changing:", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Handle Form Submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
      const response = await fetch("http://localhost:5002/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data); // Displays backend response

      if (response.ok) {    
        alert("Signup successful!");
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

 
 
 return(
<div className="flex h-screen w-full">
<div className="w-20% h-full ">
<img src={SignUp} alt="SignUp" className="h-full  object-cover" />
</div>

<div className="w-3/6 flex items-center justify-center">
  <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create Your Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name"placeholder="First Name" className="w-full px-4 py-2 border rounded-md" 
        onChange={handleChange}
         value={formData.name}/>
        <input type="text" name="lastname" placeholder="Last Name" className="w-full px-4 py-2 border rounded-md"
         onChange={handleChange}
         value={formData.lastname} />
        <input type="email" name="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md" 
         onChange={handleChange}
         value={formData.email}/>
        <input type="Number" name="contactnum" placeholder="Contact Number" className="w-full px-4 py-2 border rounded-md" 
         onChange={handleChange}
         value={formData.contactnum}/>
        <input type="text" name="permanentadd" placeholder="Permanent Address" className="w-full px-4 py-2 border rounded-md" 
         onChange={handleChange}
         value={formData.permanentadd}/>
        <input type="Number" name="Pincode" placeholder="PIN Code" className="w-full px-4 py-2 border rounded-md" 
         onChange={handleChange}
         value={formData.Pincode}/>
    <select
  name="role"
  className="w-full px-4 py-2 border rounded-md"
  onChange={handleChange}
  value={formData.role}
  required
>
  <option value="">Select Role</option>
  <option value="user">User</option>
  <option value="admin">admin</option>
</select>
        <input type="password" name="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md" 
         onChange={handleChange}
         value={formData.password}/>
      
        <button type="submit"  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Sign Up
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600">
        Already have an account? <button type="submit" className="text-blue-600 underline cursor-pointer"
        onClick={()=>navigate('/login')}>Login</button>
      </p>
    </div>
  </div>
</div>   
    )
}

export default Signup;