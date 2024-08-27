"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  getChallengeById,
  adminDeleteParticipation,
  adminApproveParticipation,
} from "@/api/challengesApi";
import { getCookies } from "@/api/serverFn";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ChallengeReportDetailPage() {
  const [token, setToken] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const { challengeid } = useParams();
  const router = useRouter();

  const asyncFunc = useCallback(async () => {
    const token: any = await getCookies("token");
    setToken(token.value);

    const data = await getChallengeById(challengeid as string, token.value);
    setChallenge(data.challenges);
  }, [challengeid]);

  useEffect(() => {
    if (challengeid) asyncFunc();
  }, [challengeid, asyncFunc]);

  if (!challenge || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FDFCDC]">
        <p className="text-lg text-[#283618]">Loading...</p>
      </main>
    );
  }

  const handleApproveParticipant = async (participantId: string) => {
    console.log(token);
    try {
      const result = await adminApproveParticipation(
        challengeid as string,
        participantId,
        token
      );
      await Swal.fire({
        title: "Approved",
        text: result.msg,
        icon: "success",
      });
      console.log(challenge.participants.length);
      if (challenge.participants.length <= 0) {
        router.push("/report");
      }
      asyncFunc();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response.data.msg,
        icon: "error",
      });
    }
  };

  const handleDeleteParticipant = async (participantId: string) => {
    try {
      const result = await adminDeleteParticipation(
        challengeid as string,
        participantId,
        token
      );
      Swal.fire({
        title: "Deleted",
        text: result.msg,
        icon: "success",
      });
      console.log(challenge.participants.length);
      if (challenge.participants.length <= 0) {
        router.push("/report");
      }
      asyncFunc();
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response.data.msg,
        icon: "error",
      });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FDFCDC] p-6">
      <div className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-[#0081A7] mb-4">
          {challenge.title}
        </h2>
        <p className="text-l font-semibold text-[#0081A7] mb-4">
          {challenge.description}
        </p>
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-[#0081A7] mb-4">
            Reported Participants
          </h3>
          <ul className="space-y-4">
            {challenge.participants
              .filter((participant: any) => participant.reported.count > 0)
              .map((participant: any, index: number) => (
                <li key={index} className="border-b pb-4">
                  <Image
                    src={`http://localhost:5000/${participant.proofOfCompletion}`}
                    alt="Proof of Completion"
                    width={180}
                    height={0}
                    className="rounded-xl shadow-md object-cover"
                  />
                  <p className="text-lg font-medium text-[#283618]">
                    User: @{participant.user.username}
                  </p>
                  <p className="text-sm text-gray-600">
                    Reported: {participant.reported.count} times
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() =>
                        handleApproveParticipant(participant.user._id)
                      }
                      className="bg-green-500 text-white p-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteParticipant(participant.user._id)
                      }
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
