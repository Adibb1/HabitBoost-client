"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getCookies } from "@/api/serverFn";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getUserById } from "@/api/usersApi";

export default function ProfilePage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>([]);
  const [publicHabits, setPublicHabits] = useState<any[]>([]);
  const { userid } = useParams(); // get id from params

  const asyncFunction = async () => {
    const token: any = await getCookies("token");
    setToken(token.value);

    if (token && userid) {
      // get user
      const user = await getUserById(userid, token.value);
      setUser(user);

      // filter public habits
      const publicHabits = user.habits.filter(
        (habit: any) => habit.habit && habit.habit.isPublic
      );
      setPublicHabits(publicHabits);
    }
  };
  useEffect(() => {
    asyncFunction();
  }, [token, userid, asyncFunction]);

  if (!token || !userid) {
    console.log(token, userid);
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FDFCDC]">
        <p className="text-lg text-[#283618]">Loading...</p>
      </main>
    );
  }

  // console.log(token);
  // console.log(userid);
  console.log(publicHabits);
  // console.log(user);

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#FDFCDC] p-6">
      <div className="w-full max-w-screen-xl bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-8">
        <div className="flex flex-col md:flex-row items-center w-full">
          <div className="flex justify-center md:justify-start mb-6 md:mb-0 md:mr-8">
            <Image
              src={`http://localhost:5000/${user.profilePicture}`}
              alt="Profile Picture"
              width={180}
              height={0}
              className="rounded-xl shadow-md object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#0081A7] mb-4">
              {user.fullname}
            </h2>
            <p className="text-lg text-[#283618] mb-6">@{user.username}</p>
            <div className="text-[#283618] mb-6">
              <p>Email: {user.email}</p>
              <p>Joined: {new Date(user.joinedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#0081A7] mb-4">
                <Link href="/badge">Badges</Link>
              </h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {user.badges?.length > 0 ? (
                  user.badges.map((badge: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center text-center text-white font-bold"
                    >
                      <div className="w-16 h-16 bg-[#F07167] rounded-full flex items-center justify-center">
                        <Image
                          src={`http://localhost:5000/${badge.badge.icon}`}
                          alt={badge.badge.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-sm mt-2 text-[#283618]">
                        {badge.badge.name}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#F07167]">No badges yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Public Habits Section */}
        <div className="w-full">
          <h3 className="text-2xl font-semibold text-[#0081A7] mb-4">
            <Link href="/habit">Public Habit</Link>
          </h3>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {publicHabits.length > 0 ? (
              publicHabits.map((habit: any, index: number) => (
                <div
                  key={index}
                  className="bg-[#E9EDC9] rounded-lg p-4 w-full md:w-1/2 lg:w-1/3"
                >
                  <h4 className="text-lg font-bold text-[#283618]">
                    {habit.habit.title}
                  </h4>
                  <p className="text-[#283618]">{habit.habit.description}</p>
                  <p className="text-sm text-[#283618] font-medium">
                    Frequency: {habit.habit.frequency}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[#F07167]">No public habits yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
