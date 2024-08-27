import axios from "axios";

// Get all badges
export const getBadges = async (auth: string) => {
  const res = await axios.get(
    "https://habitboost-server-1.onrender.com/badge",
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Add a badge
export const addBadge = async (badge: any, auth: string) => {
  const res = await axios.post(
    "https://habitboost-server-1.onrender.com/badge",
    badge,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Edit a badge
export const editBadge = async (
  badgeid: string,
  newbadge: any,
  auth: string
) => {
  const res = await axios.put(
    `https://habitboost-server-1.onrender.com/badge/${badgeid}`,
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

// Delete a badge
export const deleteBadge = async (badgeid: string, auth: string) => {
  const res = await axios.delete(
    `https://habitboost-server-1.onrender.com/badge/${badgeid}`,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};
