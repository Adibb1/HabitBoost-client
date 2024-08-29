import axios from "axios";

// Get all quotes
export const getQuotes = async (auth: string) => {
  const res = await axios.get("http://localhost:5000/quote", {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};

// Add a quote
export const addQuote = async (quote: any, auth: string) => {
  const res = await axios.post("http://localhost:5000/quote", quote, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};

// Delete a quote
export const deleteQuote = async (quoteid: string, auth: string) => {
  const res = await axios.delete(`http://localhost:5000/quote/${quoteid}`, {
    headers: {
      Authorization: `Bearer ${auth}`,
    },
  });
  return res.data;
};
