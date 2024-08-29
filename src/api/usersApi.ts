import axios from "axios";

// Register
export const registerUser = async (user: any) => {
  const res = await axios.post("http://localhost:5000/profile/register", user, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Login
export const loginUser = async (user: any) => {
  const res = await axios.post("http://localhost:5000/profile/login", user);
  return res.data;
};

// Get user
export const getUser = async () => {
  const res = await axios.get("http://localhost:5000/profile/");
  return res.data;
};

// Get user by ID
export const getUserById = async (userid: any, auth: string) => {
  const res = await axios.get(`http://localhost:5000/profile/${userid}`, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
