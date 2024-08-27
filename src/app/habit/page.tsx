"use client";
import { useState, useEffect } from "react";
import { getCookies } from "@/api/serverFn";
import { getHabits, addHabits } from "@/api/habitsApi";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import moment from "moment";
import Link from "next/link";

export default function HabitPage() {
  const [token, setToken] = useState<string | null>(null); // JWT TOKEN
  const [habits, setHabits] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search Query
  const { register, handleSubmit, reset } = useForm();

  const asyncFunc = async () => {
    const token: any = await getCookies("token");
    setToken(token.value);

    const habits = await getHabits(token.value);
    setHabits(habits);
    console.log(token.value);
  };

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
  // console.log(token);

  const onSubmit = async (data: any) => {
    try {
      const result = await addHabits(data, token);
      Swal.fire({
        title: "Success!",
        text: result.msg,
        icon: "success",
      });
      console.log(result.a);
      reset();
      asyncFunc(); // Refresh the habit list after adding a new habit
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || "Something went wrong!";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  // Sort habits: those not yet checked in appear at the top
  const sortedHabits = habits.sort((a, b) => {
    const aCheckedInToday = a.daysCompleted.some(
      (day: any) => day.date === moment().format("YYYY-MM-DD")
    );
    const bCheckedInToday = b.daysCompleted.some(
      (day: any) => day.date === moment().format("YYYY-MM-DD")
    );
    return aCheckedInToday === bCheckedInToday ? 0 : aCheckedInToday ? 1 : -1;
  });

  // Filter habits based on the search query
  const filteredHabits = sortedHabits.filter((habit) =>
    habit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(habits);
  return (
    <main className="min-h-screen bg-[#FDFCDC] p-6 flex flex-col items-center">
      <div className="w-full max-w-screen-lg">
        <h2 className="text-3xl font-semibold text-[#0081A7] mb-6">
          Your Habits
        </h2>
        {/* Add Habit Form */}
        <form
          className="mt-12 bg-white p-6 rounded-lg shadow-lg text-black"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-2xl font-semibold text-[#0081A7] mb-6">
            Add New Habit
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              {...register("title")}
              className="p-3 w-full rounded-md shadow-sm border border-gray-300 focus:ring-[#0081A7] focus:border-[#0081A7]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              className="p-3 w-full rounded-md shadow-sm border border-gray-300 focus:ring-[#0081A7] focus:border-[#0081A7]"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <select
              {...register("frequency")}
              className="p-3 w-full rounded-md shadow-sm border border-gray-300 focus:ring-[#0081A7] focus:border-[#0081A7]"
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                {...register("isPublic")}
                className="h-6 w-6 mr-2"
              />
              Make Habit Public
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="py-2 px-4 bg-[#0081A7] text-white rounded-lg shadow-md hover:bg-[#005F73] transition duration-200"
            >
              Add Habit
            </button>
          </div>
        </form>

        {/* Search Bar */}
        <div className="my-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search habits..."
            className="p-3 w-full rounded-md shadow-sm border border-gray-300 focus:ring-[#0081A7] focus:border-[#0081A7] text-black "
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Habits List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredHabits.length > 0 ? (
            filteredHabits.map((habit: any, index: number) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#283618] mb-2">
                    {habit.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-2">
                    {habit.description}
                  </p>
                  <p className="text-sm text-[#6B7280] mb-2">
                    Frequency: {habit.frequency}
                  </p>
                  {!habit.daysCompleted.some(
                    (day: any) => day.date === moment().format("YYYY-MM-DD")
                  ) && (
                    <p className="text-sm text-green-600 font-semibold">
                      Check In Now!
                    </p>
                  )}
                </div>
                <div className="flex mt-4 sm:mt-0 space-x-4">
                  <button className="py-2 px-4 bg-[#528ad9] text-white rounded-lg shadow-md hover:bg-[#6f9dde] transition duration-200">
                    <Link href={`/habit/${habit?._id}`}>Details</Link>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-[#6B7280]">No habits found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
