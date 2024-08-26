"use client";
import { useState, useEffect } from "react";
import { useJwt } from "react-jwt";
import { getCookies } from "@/api/serverFn";
import { getChallenge, addChallenge } from "@/api/challengesApi";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Link from "next/link";
import moment from "moment";
import { getUserById } from "@/api/usersApi";

export default function ChallengePage() {
  const [token, setToken] = useState<string | null>(null); // JWT TOKEN
  const { decodedToken }: any = useJwt(token || ""); // CURRENT USER INFO (jwt token after decoded)
  const [challenges, setChallenges] = useState<any[]>([]);
  const [user, setUser] = useState<any>([]);
  const { register, handleSubmit, reset } = useForm();
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

  const asyncFunc = async () => {
    // fetch token
    const token: any = await getCookies("token");
    setToken(token.value);

    // get challenges
    const challenges = await getChallenge(token.value);
    setChallenges(challenges.challenges);

    // get current user
    if (decodedToken) {
      const user = await getUserById(decodedToken?.data._id, token.value);
      setUser(user);
    }
  };
  useEffect(() => {
    asyncFunc();
  }, [decodedToken]);

  if (!token || !decodedToken) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FDFCDC]">
        <p className="text-lg text-[#283618]">Loading...</p>
      </main>
    );
  }

  const onSubmit = async (data: any) => {
    const currentTime = moment();
    const lastAdded = moment(user.lastAddedChallenge);
    let diff = currentTime.diff(lastAdded, "days");
    if (!user.lastAddedChallenge) diff = 1;
    console.log(user.lastAddedChallenge);
    if (diff == 0) {
      Swal.fire({
        title: "Error",
        text: "You've reached the limit of challenges you can add per day",
        icon: "error",
      });
      reset();
    } else {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("proofOfCompletion", data.proofOfCompletion[0]);
        formData.append("createdBy", decodedToken.data._id);

        const result = await addChallenge(formData, token);
        Swal.fire({
          title: "Success!",
          text: result.msg,
          icon: "success",
        });
        reset(); //reset form
        asyncFunc(); // refresh the challenge list after adding a new challenge
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

  const userChallenges = challenges.filter((challenge: any) => {
    return (
      challenge.createdBy._id === decodedToken.data._id &&
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const otherChallenges = challenges.filter((challenge: any) => {
    return (
      challenge.createdBy._id !== decodedToken.data._id &&
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // console.log(challenges);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FDFCDC] p-6">
      <div className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-[#0081A7] mb-4">
          Add New Challenge
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              {...register("title", { required: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0081A7] focus:border-[#0081A7] sm:text-sm text-black"
              placeholder="e.g., 30 Days Pushup Challenge"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0081A7] focus:border-[#0081A7] sm:text-sm text-black"
              placeholder="e.g., Do 100 pushups every day"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Proof of Completion (image)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("proofOfCompletion", { required: true })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0081A7] focus:border-[#0081A7] sm:text-sm text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#0081A7] text-white p-2 rounded-md hover:bg-[#007090] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0081A7]"
          >
            Add Challenge
          </button>
        </form>

        <input
          type="text"
          placeholder="Search challenges..."
          className="p-3 w-full rounded-md shadow-sm border border-gray-300 focus:ring-[#0081A7] focus:border-[#0081A7] text-black mb-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <h3 className="text-xl font-semibold text-[#0081A7] mb-4">
          Your Community Challenges
        </h3>
        <div className="space-y-4">
          {userChallenges.length > 0 ? (
            userChallenges.map((challenge: any, index: number) => (
              <div
                key={index}
                className="p-4 bg-[#FEFAE0] rounded-lg shadow-sm text-black"
              >
                <Link href={`/challenge/${challenge._id}`}>
                  <h4 className="text-lg font-semibold text-[#283618] cursor-pointer">
                    {challenge.title}
                  </h4>
                </Link>
                <p className="text-sm text-[#8B8B8B]">
                  Created by: @{challenge.createdBy.username}
                </p>
              </div>
            ))
          ) : (
            <p className="text-[#F07167]">No challenges found.</p>
          )}
        </div>

        <h3 className="text-xl font-semibold text-[#0081A7] mb-4 mt-10">
          Other Community Challenges
        </h3>
        <div className="space-y-4">
          {otherChallenges.length > 0 ? (
            otherChallenges.map((challenge: any, index: number) => (
              <div
                key={index}
                className="p-4 bg-[#FEFAE0] rounded-lg shadow-sm text-black"
              >
                <Link href={`/challenge/${challenge._id}`}>
                  <h4 className="text-lg font-semibold text-[#283618] cursor-pointer">
                    {challenge.title}
                  </h4>
                </Link>
                <p className="text-sm text-[#8B8B8B]">
                  Created by: @{challenge.createdBy.username}
                </p>
              </div>
            ))
          ) : (
            <p className="text-[#F07167]">No challenges found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
