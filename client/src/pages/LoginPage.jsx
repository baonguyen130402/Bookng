import { Link, Navigate } from "react-router-dom";
import axios from "axios";

import { useForm } from "../lib/hooks/";
import { useContext, useState } from "react";
import { UserContext } from "../lib/contexts/UserContext";

export default function LoginPage() {
  const initialValue = {
    email: "",
    password: "",
  };

  const [formValues, setFormValues] = useForm(initialValue);
  const [redirect, setRedirect] = useState(false);

  const { setUser } = useContext(UserContext);

  async function handleLoginSubmit(e) {
    e.preventDefault();

    try {
      const { data } = await axios.post("/login", {
        ...formValues,
      });
      setUser(data);
      alert("Login successful");
      setRedirect(true);
    } catch (e) {
      alert("Login failed");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
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
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
