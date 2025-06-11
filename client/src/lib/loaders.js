import { redirect } from "react-router-dom";
import apiRequest from "./apiRequest";

// ✅ ObjectID validator (24-character hex string)
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export const singlePageLoader = async ({ params }) => {
  const { id } = params;

  if (!isValidObjectId(id)) {
    console.warn("Invalid ObjectID:", id);
    return redirect("/not-found");
  }

  try {
    const res = await apiRequest("/posts/" + id);
    return res.data;
  } catch (err) {
    console.error("Error fetching single post:", err);
    return redirect("/not-found");
  }
};

export const listPageLoader = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.search; // includes the `?`

  const postResponse = apiRequest("/posts" + query);
  return {
    postResponse,
  };
};

export const profilePageLoader = async () => {
  const postResponse = apiRequest("/users/profilePosts");
  const chatResponse = apiRequest("/chats");

  return {
    postResponse,
    chatResponse,
  };
};
