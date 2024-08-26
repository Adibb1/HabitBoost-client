"use client";
import Image from "next/image";
import { checkCookie, getCookies } from "@/api/serverFn";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useJwt } from "react-jwt";
import { getHabits } from "@/api/habitsApi";
import moment from "moment";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const { decodedToken }: any = useJwt(token || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [habits, setHabits] = useState<any[]>([]);

  const asyncFunc = async () => {
    const loggedIn = await checkCookie("token");
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const token: any = await getCookies("token");
      if (token) {
        setToken(token.value);
        const fetchedHabits = await getHabits(token.value);
        setHabits(fetchedHabits);
      }
    }
  };

  useEffect(() => {
    asyncFunc();
  }, [decodedToken]);

  const randomHabits = habits.sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#FDFCDC] relative overflow-x-hidden">
      <div className="text-center w-full max-w-[calc(100%-50px)] mx-auto p-6 md:p-10 bg-white rounded-xl shadow-lg relative z-10 flex flex-col justify-center">
        {/* Section 1: Text on Left, Image on Right */}
        <div className="flex flex-col lg:flex-row items-center mb-10">
          <div className="lg:w-1/2 text-left lg:pr-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0081A7] mb-4 md:mb-6">
              Welcome to HabitBoost
            </h1>
            <p className="text-base md:text-lg text-[#283618]">
              Build lasting habits and stay motivated to achieve your goals.
              Embrace consistency and transform your life.
            </p>
          </div>
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <div className="flex-shrink-0">
              <Image
                src={`http://localhost:5000/homepage.png`}
                alt="Badge Icon"
                width={1000}
                height={1000}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="flex flex-col items-center mb-10">
            <div className="flex gap-4">
              <Link href="/register" passHref>
                <p className="px-6 py-2 md:px-8 md:py-3 bg-[#0081A7] text-white rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
                  Get Started
                </p>
              </Link>
              <Link href="/login" passHref>
                <p className="px-6 py-2 md:px-8 md:py-3 bg-[#FED9B7] text-[#283618] rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
                  Log In
                </p>
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full mb-10">
            <h2 className="text-xl md:text-2xl font-semibold text-[#0081A7] mb-4">
              Your Daily Habits
            </h2>
            {randomHabits.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {randomHabits.map((habit: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 md:p-5 bg-white rounded-xl shadow-lg border flex justify-between items-center hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center">
                      {/* Habit Icon */}
                      <img
                        src="http://localhost:5000/icon-book.png"
                        alt={habit.title}
                        className="mr-4"
                        style={{ width: "30px", height: "30px" }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-medium text-[#283618] mb-1">
                          {habit.title}
                        </h3>
                        {!habit.daysCompleted.some(
                          (day: any) =>
                            day.date === moment().format("YYYY-MM-DD")
                        ) && (
                          <p className="text-sm text-green-600 font-medium">
                            Check In Now!
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-2 md:ml-4">
                      <Link href={`/habit/${habit?._id}`} passHref>
                        <p className="py-1.5 px-3 md:py-2 md:px-4 bg-[#528ad9] text-white rounded-full shadow hover:bg-[#6f9dde] transition-transform transform hover:scale-105">
                          Details
                        </p>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Link href={`/habit`} passHref>
                <p className="py-2 px-4 md:py-3 md:px-5 bg-[#528ad9] text-white rounded-full shadow-lg hover:bg-[#6f9dde] transition-transform transform hover:scale-105 text-center">
                  Start Adding Habits
                </p>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
