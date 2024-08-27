"use client";
import Link from "next/link";
import { registerUser } from "@/api/usersApi";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Register() {
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    profilePicture: null, // to store the profile picture file
  });

  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null); // to store the preview URL

  const onChangeHandler = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      const file = files[0];
      setUser({ ...user, profilePicture: file });
      setPreview(URL.createObjectURL(file)); // create a preview URL
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const onSubmithandler = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullname", user.fullname);
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("password", user.password);
      if (user.profilePicture) {
        formData.append("profilePicture", user.profilePicture);
      }

      let data = await registerUser(formData);
      Swal.fire({
        title: "Good job!",
        text: data.msg,
        icon: "success",
      });
      router.push("/login");
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response.data.msg || "Something went wrong!";
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
          Create an Account
        </h1>
        <form className="mt-6" onSubmit={onSubmithandler}>
          {/* Full name */}
          <div className="mb-4">
            <label className="block text-[#F07167]">Full Name</label>
            <input
              type="text"
              name="fullname"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md bg-[#FDFCDC] text-[#0081A7] focus:ring-[#00AFB9] focus:border-[#00AFB9] focus:outline-none focus:ring-1"
              placeholder="John Doe"
              onChange={onChangeHandler}
            />
          </div>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-[#F07167]">Username</label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md bg-[#FDFCDC] text-[#0081A7] focus:ring-[#00AFB9] focus:border-[#00AFB9] focus:outline-none focus:ring-1"
              placeholder="johndoe123"
              onChange={onChangeHandler}
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-[#F07167]">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md bg-[#FDFCDC] text-[#0081A7] focus:ring-[#00AFB9] focus:border-[#00AFB9] focus:outline-none focus:ring-1"
              placeholder="you@example.com"
              onChange={onChangeHandler}
            />
          </div>
          {/* Password */}
          <div className="mb-4">
            <label className="block text-[#F07167]">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md bg-[#FDFCDC] text-[#0081A7] focus:ring-[#00AFB9] focus:border-[#00AFB9] focus:outline-none focus:ring-1"
              placeholder="••••••••"
              onChange={onChangeHandler}
            />
          </div>
          {/* Profile picture */}
          <div className="mb-6">
            <label className="block text-[#F07167]">Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              className="w-full px-4 py-2 mt-2 border rounded-md bg-[#FDFCDC] text-[#0081A7] focus:ring-[#00AFB9] focus:border-[#00AFB9] focus:outline-none focus:ring-1"
              onChange={onChangeHandler}
            />
          </div>
          {/* Profile Picture Preview */}
          {preview && (
            <div className="mb-4">
              <Image
                src={preview}
                alt="Profile Preview"
                width={100}
                height={100}
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#F07167] text-white rounded-md shadow-md transition-transform transform hover:scale-105"
          >
            Register
          </button>
        </form>
        <p className="text-center text-[#0081A7] mt-6">
          <Link href="/login">Already have an account?</Link>
        </p>
      </div>
    </div>
  );
}
