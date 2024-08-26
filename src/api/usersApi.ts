import axios from "axios";

//register
export const registerUser = async (user: any) => {
  const res = await axios.post("http://localhost:5000/profile/register", user, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
//login
export const loginUser = async (user: any) => {
  const res = await axios.post("http://localhost:5000/profile/login", user);
  return res.data;
};
//get user
export const getUser = async () => {
  const res = await axios.get("http://localhost:5000/profile/");
  return res.data;
};
//get user by id
export const getUserById = async (userid: any, auth: string) => {
  const res = await axios.get(`http://localhost:5000/profile/${userid}`, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
