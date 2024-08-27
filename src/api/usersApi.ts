import axios from "axios";

// Register
export const registerUser = async (user: any) => {
  const res = await axios.post(
    "https://habitboost-server-1.onrender.com/profile/register",
    user,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

// Login
export const loginUser = async (user: any) => {
  const res = await axios.post(
    "https://habitboost-server-1.onrender.com/profile/login",
    user
  );
  return res.data;
};

// Get user
export const getUser = async () => {
  const res = await axios.get(
    "https://habitboost-server-1.onrender.com/profile/"
  );
  return res.data;
};

// Get user by ID
export const getUserById = async (userid: any, auth: string) => {
  const res = await axios.get(
    `https://habitboost-server-1.onrender.com/profile/${userid}`,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};
