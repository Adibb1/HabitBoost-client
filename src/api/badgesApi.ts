import axios from "axios";

export const getBadges = async (auth: string) => {
  const res = await axios.get("http://localhost:5000/badge", {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
export const addBadge = async (badge: any, auth: string) => {
  const res = await axios.post("http://localhost:5000/badge", badge, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
export const editBadge = async (
  badgeid: string,
  newbadge: any,
  auth: string
) => {
  const res = await axios.put(
    `http://localhost:5000/badge/${badgeid}`,
    newbadge,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};
export const deleteBadge = async (badgeid: string, auth: string) => {
  const res = await axios.delete(`http://localhost:5000/badge/${badgeid}`, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
