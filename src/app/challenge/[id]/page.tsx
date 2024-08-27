"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  getChallengeById,
  joinChallenge,
  deleteChallenge,
  userReport,
} from "@/api/challengesApi";
import Swal from "sweetalert2";
import { getCookies } from "@/api/serverFn";
import Image from "next/image";
import { useJwt } from "react-jwt";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function ChallengeDetailPage() {
  const [token, setToken] = useState<string | null>(null);
  const { decodedToken }: any = useJwt(token || "");
  const [challenge, setChallenge] = useState<any>(null);
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const { id } = useParams();

  const asyncFunc = useCallback(async () => {
    const token: any = await getCookies("token");
    setToken(token.value);

    const data = await getChallengeById(id as string, token.value);
    setChallenge(data.challenges);
  }, [id]);

  useEffect(() => {
    if (id) asyncFunc();
  }, [id, asyncFunc]);

  if (!challenge || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FDFCDC]">
        <p className="text-lg text-[#283618]">Loading...</p>
      </main>
    );
  }

  const handleJoinChallenge = async (data: any) => {
    const formData = new FormData();
    formData.append("proofOfCompletion", data.proofOfCompletion[0]);
    try {
      const result = await joinChallenge(id as string, formData, token);
      Swal.fire({
        title: "Success!",
        text: result.msg,
        icon: "success",
      });
      reset();
      asyncFunc();
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || "Something went wrong!";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  const handleDeleteChallenge = async () => {
    try {
      const result = await deleteChallenge(id as string, token);
      Swal.fire({
        title: "Success!",
        text: result.msg,
        icon: "success",
      });
      asyncFunc();
      router.push("/challenge");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response.data.msg,
        icon: "error",
      });
    }
  };

  const handleReportParticipant = async (participantId: string) => {
    try {
      const result = await userReport(id as string, participantId, token);
      Swal.fire({
        title: "Reported",
        text: result.msg,
        icon: "success",
      });
      asyncFunc();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response.data.msg,
        icon: "error",
      });
    }
  };

  const userJoined = challenge.participants.some(
    (participant: any) => participant.user._id === decodedToken?.data._id
  );

  const isCreator = challenge.createdBy._id === decodedToken?.data._id;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FDFCDC] p-6">
      <div className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-[#0081A7] mb-4">
          {challenge.title}
        </h2>
        <p className="text-l font-semibold text-[#0081A7] mb-4">
          {challenge.description}
        </p>

        {!userJoined ? (
          <form onSubmit={handleSubmit(handleJoinChallenge)} className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Upload Proof of Completion
            </label>
            <input
              type="file"
              {...register("proofOfCompletion", { required: true })}
              className="mt-1 text-black block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0081A7] focus:border-[#0081A7] sm:text-sm"
              accept="image/*"
            />
            <button className="w-full bg-[#0081A7] text-white p-2 rounded-md hover:bg-[#007090] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0081A7] mt-5">
              Join Challenge
            </button>
          </form>
        ) : (
          <div className="bg-gray-200 rounded-l text-center">
            <h3 className="text-xl font-semibold text-[#0081A7] mb-4">
              Already Joined!
            </h3>
          </div>
        )}

        {isCreator || decodedToken?.data.isAdmin ? (
          <button
            onClick={handleDeleteChallenge}
            className="w-full bg-[#F07167] text-white p-2 rounded-md hover:bg-[#007090] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0081A7]"
          >
            Delete Challenge
          </button>
        ) : (
          <></>
        )}

        {/* Participants Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-[#0081A7] mb-4">
            Participants
          </h3>
          <ul className="space-y-4">
            {challenge.participants?.map((participant: any, index: number) => {
              const currentUserIsThatParticipant =
                participant.user._id === decodedToken?.data._id;

              const currentUserHasReported = participant.reported.users.filter(
                (user: any) => {
                  console.log(user.user, decodedToken?.data._id);
                  return user.user === decodedToken?.data._id;
                }
              );
              console.log(currentUserHasReported);

              return (
                <li key={index} className="border-b pb-4">
                  <p className="text-lg font-medium text-[#283618]">
                    User: @{participant.user.username}
                  </p>
                  <p className="text-sm text-gray-600">
                    Completed At:
                    {new Date(participant.completedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Reported: {participant.reported.count}
                  </p>
                  <div className="mt-2">
                    <Image
                      src={`http://localhost:5000/${participant.proofOfCompletion}`}
                      alt="Proof of Completion"
                      width={180}
                      height={0}
                      className="rounded-xl shadow-md object-cover"
                    />
                  </div>
                  {/* Report Button */}
                  {!currentUserIsThatParticipant &&
                    currentUserHasReported.length == 0 && (
                      <button
                        onClick={() =>
                          handleReportParticipant(participant.user._id)
                        }
                        className="mt-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                      >
                        Report Participant
                      </button>
                    )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}
