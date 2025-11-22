export const getCurrentUserId = () => {
  const id = localStorage.getItem("userId");
  return id ? Number(id) : null;
};
