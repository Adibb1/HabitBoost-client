"use server";
import { cookies } from "next/headers";

export const logout = async () => {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  allCookies.forEach((cookie) => {
    cookieStore.delete(cookie.name); //delete all cookies
  });
};

export const login = async (token: string) => {
  cookies().set("token", token); //doesnt return anything, just set a new token in cookie
};

export const getCookies = async (cookie: string) => {
  const cookieStore = cookies();
  if (cookie === "all") {
    return cookieStore.getAll(); // return all cokies
  } else {
    return cookieStore.get(cookie); //return 1 cookie
  }
};

export const checkCookie = async (cookie: string) => {
  const cookieStore = cookies();
  return cookieStore.has(cookie); //return true or false
};
