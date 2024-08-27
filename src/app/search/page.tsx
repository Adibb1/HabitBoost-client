"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/api/usersApi";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SearchUsers = () => {
  const [query, setQuery] = useState<string>("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const router = useRouter();

  const handleSearch = async (searchQuery: string) => {
    try {
      const allUsers = await getUser();
      const filteredUsers = allUsers.filter(
        (user: any) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFiltered(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    handleSearch("");
  }, [handleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    handleSearch(searchQuery);
  };

  const handleUserClick = (userId: any) => {
    router.push(`/profile/${userId}`);
  };

  console.log(filtered);

  return (
    <div className="flex flex-col items-center p-6 bg-[#FDFCDC] min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-[#D4A373]">
        Search Users
      </h1>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for users..."
        className="w-full max-w-2xl p-4 mb-6 border border-[#CCD5AE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A373] text-black"
      />
      <ul className="w-full max-w-2xl bg-white shadow-2xl rounded-lg divide-y divide-[#CCD5AE]">
        {filtered?.map((user: any) => (
          <li
            key={user._id}
            onClick={() => handleUserClick(user._id)}
            className="p-6 cursor-pointer hover:bg-[#FAEDCD] transition-colors flex items-center"
          >
            <Image
              src={`http://localhost:5000/${user.profilePicture}`}
              alt={`${user.username}'s profile picture`}
              width={60}
              height={60}
              className="rounded-lg object-cover mr-6"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-[#D4A373] text-lg">
                {user.username}
              </span>
              <span className="text-gray-600 text-sm">({user.fullname})</span>
              <span className="text-sm text-[#7d7f79]">
                Streak: {user.streak.count} days
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchUsers;
