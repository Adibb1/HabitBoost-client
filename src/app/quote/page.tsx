"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm, FieldValues, FieldError } from "react-hook-form";
import Swal from "sweetalert2";
import { getQuotes, addQuote, deleteQuote } from "@/api/quotesApi";
import { getCookies } from "@/api/serverFn";
import { useJwt } from "react-jwt";

export default function QuotePage() {
  const [token, setToken] = useState<string | null>(null); // JWT TOKEN
  const { decodedToken }: any = useJwt(token || ""); // CURRENT USER INFO (jwt token after decoded)
  const [quotes, setQuotes] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const asyncFunc = useCallback(async () => {
    const token: any = await getCookies("token");
    setToken(token.value);
    const data = await getQuotes(token.value);
    setQuotes(data.quote);
  }, []);

  useEffect(() => {
    asyncFunc();
  }, [asyncFunc]);

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FDFCDC]">
        <p className="text-lg text-[#283618]">Loading...</p>
      </main>
    );
  }

  const handleAddQuote = async (data: FieldValues) => {
    try {
      const result = await addQuote(data, token);
      Swal.fire({
        title: "Success!",
        text: result.msg,
        icon: "success",
      });
      reset();
      asyncFunc();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response.data.msg,
        icon: "error",
      });
    }
  };

  const handleDeleteQuote = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await deleteQuote(id, token);
          asyncFunc();
          Swal.fire({
            title: "Deleted!",
            text: result.msg,
            icon: "success",
          });
        } catch (error: any) {
          Swal.fire({
            title: "Error",
            text: error.response?.data?.msg,
            icon: "error",
          });
        }
      }
    });
  };

  const userQuotes = quotes.filter(
    (quote: any) => quote.author._id === decodedToken?.data._id
  );
  const otherQuotes = quotes.filter(
    (quote: any) => quote.author._id !== decodedToken?.data._id
  );

  // Random quote selection
  const randomQuote =
    otherQuotes[Math.floor(Math.random() * otherQuotes.length)];

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#FDFCDC] p-6">
      <div className="flex-1 flex items-center justify-center">
        {randomQuote && (
          <div className="max-w-xl p-8 bg-white rounded-lg shadow-lg">
            <blockquote className="text-4xl italic text-black text-center">
              &apos;{randomQuote.text}&apos;
            </blockquote>
            <cite className="text-xl text-gray-500 block text-center mt-4">
              — @{randomQuote.author.username}
            </cite>
          </div>
        )}
      </div>

      <div className="w-full max-w-screen-md bg-white rounded-lg shadow-lg p-8 mt-10">
        <h2 className="text-2xl font-semibold text-[#0081A7] mb-4">
          Add a Quote
        </h2>
        <form onSubmit={handleSubmit(handleAddQuote)} className="mb-6">
          <input
            {...register("text", {
              required: "Quote text is required",
              minLength: {
                value: 10,
                message: "Quote must be at least 10 characters long",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter new quote..."
          />
          {errors.text && (
            <p className="text-red-500 text-sm">
              {(errors.text as FieldError)?.message || "Invalid input"}
            </p>
          )}
          <button
            type="submit"
            className="mt-2 w-full bg-[#0081A7] text-white p-2 rounded-md hover:bg-[#007090]"
          >
            Add Quote
          </button>
        </form>

        <h2 className="text-2xl font-semibold text-[#0081A7] mb-4">
          Your Quotes
        </h2>
        <ul className="space-y-4">
          {userQuotes.map((quote) => (
            <li
              key={quote._id}
              className="flex flex-col bg-white p-4 shadow-sm border rounded-xl"
            >
              <blockquote className="text-lg italic text-black">
                "{quote.text}"
              </blockquote>
              <cite className="text-sm text-gray-500">
                — @{quote.author.username}
              </cite>
              <button
                onClick={() => handleDeleteQuote(quote._id)}
                className="mt-2 text-red-500 border rounded-full"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
