import Link from "next/link";
import { checkCookie, logout, getCookies } from "@/api/serverFn";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { getUser } from "@/api/usersApi";
import { useJwt } from "react-jwt";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NavLinks() {
  const [token, setToken] = useState<string | null>(null); // auth token
  const { decodedToken }: any = useJwt(token || ""); // current user info
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const router = useRouter();

  const asyncFunc = async () => {
    const loggedIn = await checkCookie("token");
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const token: any = await getCookies("token");
      setToken(token.value);
    }

    const users = await getUser();
    const currentUser = users.find(
      (user: any) => user._id === decodedToken?.data._id
    );
    setStreak(currentUser?.streak.count);
  };

  useEffect(() => {
    asyncFunc();
  }, [decodedToken, asyncFunc]);

  const userLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are going to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Good job!",
            text: "Logout successfully",
            icon: "success",
          }).then(async () => {
            await logout();
            setIsLoggedIn(false);
            setStreak(0);
            router.replace("/login");
          });
        } catch (error: any) {
          Swal.fire({
            title: "Oh no!",
            text: error.response.data.msg,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ul className="flex flex-col space-y-4 text-center flex-grow">
        <li className="text-lg hover:text-gray-300 font-semibold transition-colors duration-300">
          <Link href="/">Home</Link>
        </li>
        {isLoggedIn && (
          <>
            <li className="text-lg hover:text-gray-300 font-semibold transition-colors duration-300">
              <Link href="/habit">Habit</Link>
            </li>
            <li className="text-lg hover:text-gray-300 font-semibold transition-colors duration-300">
              <Link href="/challenge">Challenge</Link>
            </li>
            <li className="text-lg hover:text-gray-300 font-semibold transition-colors duration-300">
              <Link href="/quote">Quotes</Link>
            </li>
            <li className="text-lg hover:text-gray-300 font-semibold transition-colors duration-300">
              <Link href="/badge">Badge</Link>
            </li>
            <li className="text-lg hover:text-gray-300 font-semibold transition-colors duration-300">
              <Link href="/search">Search Users</Link>
            </li>
            {decodedToken?.data.isAdmin && (
              <li className="text-lg hover:text-gray-300 font-semibold transition-colors duration-300">
                <Link href="/report">Verify Reports</Link>
              </li>
            )}
          </>
        )}
      </ul>

      {isLoggedIn && (
        <div className="mt-auto w-full">
          <hr className="border-white my-4" />
          <ul className="text-center">
            <li className="flex items-center justify-center gap-4 mb-6 p-4 bg-[#00AFB9] rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105">
              <div className="relative">
                <Image
                  src={`http://localhost:5000/${decodedToken?.data.profilePicture}`}
                  alt="Profile Picture"
                  width={50}
                  height={50}
                  className="rounded-full border-4 border-white shadow-lg"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <Link href={`/profile/${decodedToken?.data._id}`}>
                <div className="text-left">
                  <span className="text-lg font-bold text-white block">
                    Profile
                  </span>
                  <span className="text-sm text-yellow-400 flex items-center">
                    {`🔥 ${streak}`}
                    <span className="ml-1">Streak</span>
                  </span>
                </div>
              </Link>
            </li>

            <li>
              <button
                className="w-full py-2 text-lg font-semibold text-red-500 hover:text-red-300 transition-colors duration-300 bg-[#fdfcdc] rounded-lg"
                onClick={userLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
