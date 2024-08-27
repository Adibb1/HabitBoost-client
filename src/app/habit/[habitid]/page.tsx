"use client";
import { useState, useEffect } from "react";
import { useJwt } from "react-jwt";
import { getCookies } from "@/api/serverFn";
import {
  getHabitsById,
  deleteHabits,
  editHabits,
  checkinHabit,
} from "@/api/habitsApi";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HabitDetailPage() {
  const [token, setToken] = useState<string | null>(null); // JWT TOKEN
  const [habit, setHabit] = useState<any>(null);
  const { habitid } = useParams();
  const router = useRouter();

  const asyncFunc = async () => {
    const token: any = await getCookies("token");
    setToken(token.value);

    if (habitid) {
      const habit = await getHabitsById(habitid as string, token.value);
      setHabit(habit[0]);
    }
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

  const deleteHandler = (habitid: string) => {
    try {
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
            const result = await deleteHabits(habitid, token);
            Swal.fire({
              title: "Deleted!",
              text: result.msg,
              icon: "success",
            }).then(() => {
              asyncFunc();
              router.push("/habit");
            });
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.msg || "Something went wrong!";
            Swal.fire({
              title: "Error",
              text: errorMessage,
              icon: "error",
            });
          }
        }
      });
    } catch (error) {}
  };

  const editHandler = async (habit: any) => {
    const { value: formValues }: any = await Swal.fire({
      title: "Edit Habit",
      html: `<form id="swal-form" class="flex-col">
        <label class="block text-sm font-medium text-gray-700">Title</label>
        <input id="swal-input1" class="swal2-input" value="${
          habit.title
        }" style="width: 80%;">
    
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <input id="swal-input2" class="swal2-input" value="${
          habit.description
        }" style="width: 80%;">
    
        <label class="block text-sm font-medium text-gray-700">Frequency</label>
        <select id="swal-input3" class="swal2-select border" style="width: 80%;">
          <option value="daily" ${
            habit.frequency == "daily" ? "selected" : ""
          }>Daily</option>
          <option value="weekly" ${
            habit.frequency == "weekly" ? "selected" : ""
          }>Weekly</option>
        </select>
    
        <label class="block text-sm font-medium text-gray-700">Public Habit</label>
        <input id="swal-input4" type="checkbox" class="mt-1 h-6 w-6" ${
          habit.isPublic ? "checked" : ""
        }/>

      </form>`,
      focusConfirm: false,
      preConfirm: () => {
        const input1 = (
          document.getElementById("swal-input1") as HTMLInputElement
        ).value;
        const input2 = (
          document.getElementById("swal-input2") as HTMLInputElement
        ).value;
        const input3 = (
          document.getElementById("swal-input3") as HTMLInputElement
        ).value;
        const input4 = (
          document.getElementById("swal-input4") as HTMLInputElement
        ).checked;

        if (!input1 || !input2 || !input3) {
          Swal.showValidationMessage("All fields are required!");
          return null;
        }

        return {
          title: input1,
          description: input2,
          frequency: input3,
          isPublic: input4,
        };
      },
    });
    if (formValues) {
      try {
        const result = await editHabits(habit._id, formValues, token);
        Swal.fire({
          title: "Edited!",
          text: result.msg,
          icon: "success",
        }).then(() => {
          asyncFunc();
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.msg || "Something went wrong!";
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
        });
      }
    }
  };

  const checkInHandler = async (habitid: string) => {
    Swal.fire({
      title: "Are you sure you've done this habit?",
      text: "The real progress is on yourself, not the badges",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I've done it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await checkinHabit(habitid, token);
          Swal.fire({
            title: "Check In Successfully!",
            text: result.msg,
            icon: "success",
          }).then(() => {
            asyncFunc();
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.msg || "Something went wrong!";
          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#FDFCDC] p-6 flex flex-col items-center">
      <div className="w-full max-w-screen-lg">
        <h2 className="text-3xl font-semibold text-[#0081A7] mb-6 flex gap-3">
          <button className="py-2 px-4 bg-[#528ad9] text-white rounded-lg shadow-md hover:bg-[#6f9dde] transition duration-200 text-sm">
            <Link href={`/habit`}>{"<- Back"}</Link>
          </button>
          Your Habit
        </h2>
        {habit ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold text-[#283618] mb-4">
              {habit.title}
            </h3>
            <p className="text-lg text-[#6B705C] mb-2">
              <span className="font-medium">Description:</span>{" "}
              {habit.description || "No description provided."}
            </p>
            <p className="text-lg text-[#6B705C] mb-2">
              <span className="font-medium">Frequency:</span> {habit.frequency}
            </p>
            <p className="text-lg text-[#6B705C] mb-2">
              <span className="font-medium">Created At:</span>{" "}
              {new Date(habit.createdAt).toLocaleDateString()}
            </p>
            <p className="text-lg text-[#6B705C] mb-2">
              <span className="font-medium">Public Habit:</span>{" "}
              {habit.isPublic ? "Yes" : "No"}
            </p>
            <p className="text-lg text-[#6B705C] mb-4">
              <span className="font-medium">Days Completed:</span>{" "}
              {habit.daysCompleted.length}
            </p>

            <div className="flex gap-4">
              <button
                className="bg-[#0081A7] text-white px-4 py-2 rounded"
                onClick={() => editHandler(habit)}
              >
                Edit
              </button>
              <button
                className="bg-[#D33F49] text-white px-4 py-2 rounded"
                onClick={() => deleteHandler(habit._id)}
              >
                Delete
              </button>
              {!habit.daysCompleted.some(
                (day: any) => day.date === moment().format("YYYY-MM-DD")
              ) && (
                <button
                  className="py-2 px-4 bg-[#0081A7] text-white rounded-lg shadow-md hover:bg-[#005F73] transition duration-200"
                  onClick={() => checkInHandler(habit._id)}
                >
                  Check In
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-lg text-[#283618]">No habit found.</p>
        )}
      </div>
    </main>
  );
}
