"use client";
import { useState, useEffect, useCallback } from "react";
import { getBadges, addBadge, editBadge, deleteBadge } from "@/api/badgesApi";
import Swal from "sweetalert2";
import { useJwt } from "react-jwt";
import { getCookies } from "@/api/serverFn";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { getUserById } from "@/api/usersApi";

export default function BadgePage() {
  const [token, setToken] = useState<string | null>(null); // JWT TOKEN
  const { decodedToken }: any = useJwt(token || ""); // CURRENT USER INFO (jwt token after decoded) BUT NOT UPDATED
  const [user, setUser] = useState<any>([]);
  const [ownedBadges, setOwnedBadges] = useState<any[]>([]);
  const [unownedBadges, setUnownedBadges] = useState<any[]>([]);
  const { register, handleSubmit, reset } = useForm();

  const asyncFunc = useCallback(async () => {
    const tokenData: any = await getCookies("token");
    setToken(tokenData.value);

    if (tokenData.value && decodedToken) {
      const userData: any = await getUserById(
        decodedToken.data._id,
        tokenData.value
      );
      setUser(userData);

      const badgesData = await getBadges(tokenData.value);

      const owned = badgesData.badges.filter((badge: any) =>
        userData.badges.some(
          (userbadge: any) => userbadge.badge._id === badge._id
        )
      );
      setOwnedBadges(owned);

      const unowned = badgesData.badges.filter(
        (badge: any) =>
          !userData.badges.some(
            (userbadge: any) => userbadge.badge._id === badge._id
          )
      );
      setUnownedBadges(unowned);
    }
  }, [decodedToken]);

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

  const handleAddBadge = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("criteria", data.criteria);
      formData.append("icon", data.icon[0]);

      const result = await addBadge(formData, token);
      Swal.fire({
        title: "Success!",
        text: result.msg,
        icon: "success",
      });
      reset();
      asyncFunc();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to add badge.",
        icon: "error",
      });
    }
  };

  const handleDeleteBadge = async (id: string) => {
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
          const result = await deleteBadge(id, token);
          Swal.fire({
            title: "Deleted!",
            text: result.msg,
            icon: "success",
          });
          asyncFunc(); // Refresh the badges list
        } catch (error: any) {
          Swal.fire({
            title: "Error",
            text: error.response.data.msg,
            icon: "error",
          });
        }
      }
    });
  };

  const handleEditBadge = async (badge: any) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Badge",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Name" value="${badge.name}">
        <input id="swal-input2" class="swal2-input" placeholder="Description" value="${badge.description}">
        <input id="swal-input3" class="swal2-input" placeholder="Criteria" value="${badge.criteria}">
        <input id="swal-input4" type="file" class="swal2-file">
        <img id="swal-img-preview" src="http://localhost:5000/${badge.icon}" alt="Icon Preview" class="swal2-image" style="margin-top: 10px; max-width: 100px;">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = (
          document.getElementById("swal-input1") as HTMLInputElement
        ).value;
        const description = (
          document.getElementById("swal-input2") as HTMLInputElement
        ).value;
        const criteria = (
          document.getElementById("swal-input3") as HTMLInputElement
        ).value;
        const iconFile = (
          document.getElementById("swal-input4") as HTMLInputElement
        ).files?.[0];
        return { name, description, criteria, iconFile };
      },
      didOpen: () => {
        const inputFile = document.getElementById(
          "swal-input4"
        ) as HTMLInputElement;
        const imgPreview = document.getElementById(
          "swal-img-preview"
        ) as HTMLImageElement;

        inputFile.addEventListener("change", () => {
          if (inputFile.files && inputFile.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
              imgPreview.src = e.target?.result as string;
            };
            reader.readAsDataURL(inputFile.files[0]);
          }
        });
      },
    });

    if (formValues) {
      const { name, description, criteria, iconFile } = formValues;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("criteria", criteria);
      if (iconFile) {
        formData.append("icon", iconFile);
      }

      try {
        const result = await editBadge(badge._id, formData, token);
        Swal.fire({
          title: "Success!",
          text: result.msg,
          icon: "success",
        });
        asyncFunc(); // Refresh the badges list
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error.response.data.msg || "Failed to edit badge.",
          icon: "error",
        });
      }
    }
  };

  console.log(unownedBadges);
  return (
    <main className="min-h-screen flex flex-col items-center bg-[#FDFCDC] p-6">
      <div className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-[#0081A7] mb-6">Badges</h2>

        {user.isAdmin && (
          <>
            <form
              onSubmit={handleSubmit(handleAddBadge)}
              className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                className="w-full p-3 border border-gray-300 rounded-md text-black"
                placeholder="Name..."
                {...register("name", { required: true })}
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-md text-black"
                placeholder="Description..."
                {...register("description", { required: true })}
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-md text-black"
                placeholder="Criteria..."
                {...register("criteria", { required: true })}
              />
              <input
                type="file"
                className="w-full p-3 border border-gray-300 rounded-md text-black"
                {...register("icon", { required: true })}
              />
              <button className="mt-2 w-full bg-[#0081A7] text-white p-3 rounded-md hover:bg-[#007090]">
                Add Badge
              </button>
            </form>
          </>
        )}

        <ul className="space-y-6">
          {unownedBadges?.map((badge) => (
            <li
              key={badge._id}
              className="flex flex-col md:flex-row items-center bg-[#F9F9F9] p-4 rounded-lg shadow-md"
            >
              <div className="flex-shrink-0">
                <Image
                  src={`http://localhost:5000/${badge.icon}`}
                  alt="Badge Icon"
                  width={80}
                  height={80}
                  className="rounded-lg shadow-md object-cover"
                />
              </div>
              <div className="flex-grow md:ml-6 text-center md:text-left mt-4 md:mt-0">
                <h5 className="text-xl font-bold text-[#333]">{badge.name}</h5>
                <p className="text-[#555] mt-2">{badge.description}</p>
                <p className="text-[#2379bf] mt-1 font-bold">
                  Criteria: {badge.criteria}
                </p>
              </div>
              {user.isAdmin && (
                <div className="flex flex-col md:flex-row mt-4 md:mt-0 md:ml-6 space-y-2 md:space-y-0 md:space-x-4">
                  <button
                    onClick={() => handleEditBadge(badge)}
                    className="text-[#FFA500] font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBadge(badge._id)}
                    className="text-red-500 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
          {ownedBadges?.map((badge) => (
            <li
              key={badge._id}
              className="flex flex-col md:flex-row items-center bg-[#b8b8b8] p-4 rounded-lg shadow-md"
            >
              <div className="flex-shrink-0">
                <Image
                  src={`http://localhost:5000/${badge.icon}`}
                  alt="Badge Icon"
                  width={80}
                  height={80}
                  className="rounded-lg shadow-md object-cover"
                />
              </div>
              <div className="flex-grow md:ml-6 text-center md:text-left mt-4 md:mt-0">
                <h5 className="text-xl font-bold text-[#333]">
                  {badge.name} <span className="font-semibold">- Owned</span>
                </h5>
                <p className="text-[#555] mt-2">{badge.description}</p>
                <p className="text-[#2379bf] mt-1 font-bold">
                  Criteria: {badge.criteria}
                </p>
              </div>
              {user.isAdmin && (
                <div className="flex flex-col md:flex-row mt-4 md:mt-0 md:ml-6 space-y-2 md:space-y-0 md:space-x-4 bg-[#F9F9F9] p-2 rounded-lg px-3">
                  <button
                    onClick={() => handleEditBadge(badge)}
                    className="text-[#FFA500] font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBadge(badge._id)}
                    className="text-red-500 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
