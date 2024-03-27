import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import { useForm } from "../lib/hooks/";

export default function RegisterPage() {
  const initialValue = {
    name: "",
    email: "",
    password: "",
  };

  const [formValues, setFormValues] = useForm(initialValue);

  async function registerUser(e) {
    e.preventDefault();

    try {
      await axios.post("/register", {
        ...formValues,
      });
      alert("Registration successful. Now you can log in");
    } catch (e) {
      alert("Registration failed. Please try again later");
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={setFormValues}
          />
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            onChange={setFormValues}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={setFormValues}
          />
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member?{" "}
            <Link className="underline text-black" to={"/login"}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
