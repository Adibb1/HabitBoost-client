import axios from "axios";

export const getChallenge = async (auth: string) => {
  const res = await axios.get("http://localhost:5000/challenge/", {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
export const getChallengeById = async (id: string, auth: string) => {
  const res = await axios.get(`http://localhost:5000/challenge/${id}`, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
export const addChallenge = async (challenge: any, auth: string) => {
  const res = await axios.post("http://localhost:5000/challenge", challenge, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
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
