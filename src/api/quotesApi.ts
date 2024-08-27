import axios from "axios";

// Get all quotes
export const getQuotes = async (auth: string) => {
  const res = await axios.get(
    "https://habitboost-server-1.onrender.com/quote",
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Add a quote
export const addQuote = async (quote: any, auth: string) => {
  const res = await axios.post(
    "https://habitboost-server-1.onrender.com/quote",
    quote,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};

// Delete a quote
export const deleteQuote = async (quoteid: string, auth: string) => {
  const res = await axios.delete(
    `https://habitboost-server-1.onrender.com/quote/${quoteid}`,
    {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    }
  );
  return res.data;
};
