import axios from "axios";

// Get all challenges
export const getChallenge = async (auth: string) => {
  const res = await axios.get(
    "https://habitboost-server-1.onrender.com/challenge/",
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Get challenge by ID
export const getChallengeById = async (id: string, auth: string) => {
  const res = await axios.get(
    `https://habitboost-server-1.onrender.com/challenge/${id}`,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Add a challenge
export const addChallenge = async (challenge: any, auth: string) => {
  const res = await axios.post(
    "https://habitboost-server-1.onrender.com/challenge",
    challenge,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Join a challenge
export const joinChallenge = async (
  challengeid: string,
  proof: any,
  auth: string
) => {
  const res = await axios.post(
    `https://habitboost-server-1.onrender.com/challenge/${challengeid}`,
    proof,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Delete a challenge
export const deleteChallenge = async (challengeid: string, auth: string) => {
  const res = await axios.delete(
    `https://habitboost-server-1.onrender.com/challenge/${challengeid}`,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Report a user
export const userReport = async (
  challengeid: string,
  userid: string,
  auth: string
) => {
  const res = await axios.put(
    `https://habitboost-server-1.onrender.com/challenge/${challengeid}/${userid}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Admin delete participation
export const adminDeleteParticipation = async (
  challengeid: string,
  userid: string,
  auth: string
) => {
  const res = await axios.put(
    `https://habitboost-server-1.onrender.com/challenge/${challengeid}/${userid}/delete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Admin approve participation
export const adminApproveParticipation = async (
  challengeid: string,
  userid: string,
  auth: string
) => {
  const res = await axios.put(
    `https://habitboost-server-1.onrender.com/challenge/${challengeid}/${userid}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};
