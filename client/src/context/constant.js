export const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://localhost:4000/api"
    : "http://url";
