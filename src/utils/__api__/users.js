import axios from "utils/axios"; // import the custom axios

const getUser = async () => {
  const res = await axios.get("/myprofile");
  return res.data;
};

const updateUser = async (data) => {
  const res = await axios.post("/myprofile", data);
  return res.data;
};

export default {
  getUser,
  updateUser
};