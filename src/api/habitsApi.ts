import axios from "axios";

export const getHabits = async (auth: string) => {
  const res = await axios.get("http://localhost:5000/habit/", {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
export const getHabitsById = async (id: string, auth: string) => {
  const res = await axios.get(`http://localhost:5000/habit/${id}`, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
export const addHabits = async (habit: any, auth: string) => {
  const res = await axios.post("http://localhost:5000/habit/", habit, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
export const editHabits = async (
  habitid: string,
  newhabit: any,
  auth: string
) => {
  const res = await axios.put(
    `http://localhost:5000/habit/${habitid}/edit`,
    newhabit,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};
export const deleteHabits = async (habitid: string, auth: string) => {
  const res = await axios.delete(`http://localhost:5000/habit/${habitid}`, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
export const checkinHabit = async (habitid: string, auth: string) => {
  const res = await axios.put(
    `http://localhost:5000/habit/${habitid}/checkin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};
