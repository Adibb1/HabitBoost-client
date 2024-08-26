"use client";
import { useState, useEffect } from "react";
import { getChallenge } from "@/api/challengesApi";
import { getCookies } from "@/api/serverFn";
import { useRouter } from "next/navigation";

export default function ReportOverviewPage() {
  const [token, setToken] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const router = useRouter();

  const asyncFunc = async () => {
    const token: any = await getCookies("token");
    setToken(token.value);

    const data = await getChallenge(token.value);
    const reportedChallenges = data.challenges.filter((challenge: any) =>
      challenge.participants.some(
        (participant: any) => participant.reported.count > 0
      )
    );

    reportedChallenges.sort((a: any, b: any) => {
      const totalReportsA = a.participants.reduce(
        (sum: number, p: any) => sum + p.reported.count,
        0
      );
      const totalReportsB = b.participants.reduce(
        (sum: number, p: any) => sum + p.reported.count,
        0
      );
      return totalReportsB - totalReportsA;
    });

    setChallenges(reportedChallenges);
  };

  useEffect(() => {
    asyncFunc();
  }, []);

  if (!challenges || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FDFCDC]">
        <p className="text-lg text-[#283618]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FDFCDC] p-6">
      <div className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-[#0081A7] mb-4">
          Reported Challenges
        </h2>
        <ul className="space-y-4">
          {challenges.map((challenge: any, index: number) => (
            <li key={index} className="border-b pb-4">
              <p className="text-lg font-medium text-[#283618]">
                {challenge.title} - Created by: @{challenge.createdBy.username}
              </p>
              <p className="text-sm text-gray-600">
                Total Reports:{" "}
                {challenge.participants.reduce(
                  (sum: number, p: any) => sum + p.reported.count,
                  0
                )}
              </p>
              <button
                onClick={() => router.push(`/report/${challenge._id}`)}
                className="mt-2 bg-[#0081A7] text-white p-2 rounded-md hover:bg-[#007090] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0081A7]"
              >
                View Details
              </button>
            </li>
          ))}
          {challenges.length == 0 && (
            <p className="text-[#F07167]">No reports found.</p>
          )}
        </ul>
      </div>
    </main>
  );
}
