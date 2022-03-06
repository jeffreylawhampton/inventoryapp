const getCurrentUser = async () => {
  const response = await fetch("/api/v1/user-sessions/current", {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  if (!response.ok) {
    const errorMessage = `${response.status} (${response.statusText})`;
    const error = new Error(errorMessage);
    throw error;
  }
  const userData = await response.json();
  console.log(userData);
  return userData;
};

export default getCurrentUser;
