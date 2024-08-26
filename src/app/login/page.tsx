"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api/usersApi";
import Swal from "sweetalert2";
import { login, getCookies } from "@/api/serverFn";

export default function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const router = useRouter();

  const onChangeHandler = (e: any) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onSubmithandler = async (e: any) => {
    e.preventDefault();
    try {
      const data = await loginUser(user);
      Swal.fire({
        title: "Success!",
        text: data.msg,
        icon: "success",
      }).then(async () => {
        await login(data.token);
        console.log(getCookies("all"));
        router.push("/");
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || "Something went wrong!";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcdc]">
      <div className="bg-[#FED9B7] p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold text-[#F07167] text-center">
          Login
        </h1>
        <form className="mt-6" onSubmit={onSubmithandler}>
          <div className="mb-4">
            <label className="block text-[#F07167]" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md bg-[#FDFCDC] text-[#0081A7] focus:ring-[#00AFB9] focus:border-[#00AFB9] focus:outline-none focus:ring-1"
              placeholder="johndoe123"
              onChange={onChangeHandler}
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#F07167]" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md bg-[#FDFCDC] text-[#0081A7] focus:ring-[#00AFB9] focus:border-[#00AFB9] focus:outline-none focus:ring-1"
              placeholder="••••••••"
              onChange={onChangeHandler}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#F07167] text-white rounded-md shadow-md transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="text-center text-[#0081A7] mt-6">
          <Link href="/register">Don't have an account? Register here.</Link>
        </p>
      </div>
    </div>
  );
}
