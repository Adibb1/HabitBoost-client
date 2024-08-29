import axios from "axios";

// Get all challenges
export const getChallenge = async (auth: string) => {
  const res = await axios.get("http://localhost:5000/challenge/", {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};

// Get challenge by ID
export const getChallengeById = async (id: string, auth: string) => {
  const res = await axios.get(`http://localhost:5000/challenge/${id}`, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};

// Add a challenge
export const addChallenge = async (challenge: any, auth: string) => {
  const res = await axios.post("http://localhost:5000/challenge", challenge, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};

// Join a challenge
export const joinChallenge = async (
  challengeid: string,
  proof: any,
  auth: string
) => {
  const res = await axios.post(
    `http://localhost:5000/challenge/${challengeid}`,
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
    `http://localhost:5000/challenge/${challengeid}`,
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
    `http://localhost:5000/challenge/${challengeid}/${userid}`,
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
    `http://localhost:5000/challenge/${challengeid}/${userid}/delete`,
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
    `http://localhost:5000/challenge/${challengeid}/${userid}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};
