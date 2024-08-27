import axios from "axios";

// Get all habits
export const getHabits = async (auth: string) => {
  const res = await axios.get(
    "https://habitboost-server-1.onrender.com/habit/",
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Get habit by ID
export const getHabitsById = async (id: string, auth: string) => {
  const res = await axios.get(
    `https://habitboost-server-1.onrender.com/habit/${id}`,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Add a habit
export const addHabits = async (habit: any, auth: string) => {
  const res = await axios.post(
    "https://habitboost-server-1.onrender.com/habit/",
    habit,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Edit a habit
export const editHabits = async (
  habitid: string,
  newhabit: any,
  auth: string
) => {
  const res = await axios.put(
    `https://habitboost-server-1.onrender.com/habit/${habitid}/edit`,
    newhabit,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Delete a habit
export const deleteHabits = async (habitid: string, auth: string) => {
  const res = await axios.delete(
    `https://habitboost-server-1.onrender.com/habit/${habitid}`,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Check in to a habit
export const checkinHabit = async (habitid: string, auth: string) => {
  const res = await axios.put(
    `https://habitboost-server-1.onrender.com/habit/${habitid}/checkin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};
