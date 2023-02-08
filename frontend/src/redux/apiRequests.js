import {
  updateStart,
  updateSuccess,
  updateError,
  getUserStart,
  getUserSuccess,
  getUserFailed,
  followUserStart,
  followUserSuccess,
  followUserFailed,
} from "./userSlice";
import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";
import {
  createPostFailed,
  createPostStart,
  createPostSuccess,
  deletePostFailed,
  deletePostStart,
  deletePostSuccess,
  getAllPostFailed,
  getAllPostStart,
  getAllPostSuccess,
  getOnePostFailed,
  getOnePostStart,
  getOnePostSuccess,
  getUserPostFailed,
  getUserPostStart,
  getUserPostSuccess,
  interactPostFailed,
  interactPostStart,
  interactPostSuccess,
} from "./postSlice";
import {
  addCommentFailed,
  addCommentStart,
  addCommentSuccess,
  deleteCommentFailed,
  deleteCommentStart,
  deleteCommentSuccess,
  getUserCommentStart,
  getUserCommentFailed,
  getUserCommentSuccess,
} from "./commentSlice";

//AUTH
export const loginUser = async (user, dispatch, navigate, state) => {
  dispatch(loginStart());
  dispatch(updateStart());
  try {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, user);
    dispatch(loginSuccess(res.data));
    dispatch(updateSuccess(res.data));
    navigate(state?.path || "/");
  } catch (e) {
    dispatch(loginFailed(e.response.data.message));
    dispatch(updateError());
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (err) {
    console.log(err.response.data);
    dispatch(registerFailed(err.response.data));
  }
};

export const logOutUser = async (dispatch, token, userId, navigate) => {
  dispatch(logoutStart());
  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, userId, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(logoutSuccess());
    localStorage.clear();
    navigate("/login");
  } catch (err) {
    dispatch(logoutFailed());
  }
};

export const updateUser = async (dispatch, user, id, token) => {
  dispatch(updateStart());
  try {
    const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, user, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(updateSuccess(res.data));
  } catch (err) {
    console.log(err);
    dispatch(updateError());
  }
};

export const getUser = async (dispatch, id, token) => {
  dispatch(getUserStart());
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(getUserSuccess(res.data));
  } catch (err) {
    dispatch(getUserFailed());
  }
};

export const followUser = async (
  dispatch,
  id,
  userId,
  token,
  setFollow,
  isFollowed
) => {
  dispatch(followUserStart());
  try {
    const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/${id}/follow`, userId, {
      headers: { token: `Bearer ${token}` },
    });
    setFollow(isFollowed ? false : true);
    const update = {
      ...res.data,
      accessToken: token,
    };
    dispatch(followUserSuccess(res.data));
    dispatch(updateSuccess(update));
  } catch (err) {
    dispatch(followUserFailed());
  }
};

//POST
export const getAllPosts = async (
  dispatch,
  token,
  hot,
  pageNumber,
  setHasMore
) => {
  dispatch(getAllPostStart());
  try {
    const res = await axios.get(
      hot
        ? `${process.env.REACT_APP_BACKEND_URL}/post?${hot}=true&page=${pageNumber}&limit=2`
        : `${process.env.REACT_APP_BACKEND_URL}/post?page=${pageNumber}&limit=2`,
      {
        headers: { token: `Bearer ${token}` },
      }
    );
    console.log("Get all post success");
    setHasMore(res.data.results.length > 0);
    dispatch(getAllPostSuccess(res.data.results));
  } catch (err) {
    dispatch(getAllPostFailed());
  }
};

export const getUserPost = async (dispatch, token, userId) => {
  dispatch(getUserPostStart());
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/post/user/${userId}`, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(getUserPostSuccess(res.data));
  } catch (err) {
    dispatch(getUserPostFailed());
  }
};

export const getOnePost = async (dispatch, token, postId) => {
  dispatch(getOnePostStart());
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/post/fullpost/${postId}`, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(getOnePostSuccess(res.data));
  } catch (err) {
    dispatch(getOnePostFailed());
  }
};

export const getUserComment = async (dispatch, token, postId) => {
  dispatch(getUserCommentStart());
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/post/comment/${postId}`, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(getUserCommentSuccess(res.data));
  } catch (err) {
    dispatch(getUserCommentFailed());
  }
};

export const createPost = async (dispatch, token, post, postToggle) => {
  dispatch(createPostStart());
  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post`, post, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(postToggle(false));
    dispatch(createPostSuccess());
  } catch (err) {
    dispatch(createPostFailed());
  }
};

export const deletePost = async (
  dispatch,
  token,
  id,
  userId,
  setDelete,
  setDeletedPostId,
  deletedPostId
) => {
  dispatch(deletePostStart());
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/post/${id}`, {
      headers: { token: `Bearer ${token}` },
      data: { userId: userId },
    });
    dispatch(deletePostSuccess());
    setDeletedPostId([...deletedPostId, id]);
    setDelete({
      open: false,
      status: true,
    });
  } catch (err) {
    dispatch(deletePostFailed());
  }
};

export const upvotePost = async (dispatch, token, id, userId) => {
  dispatch(interactPostStart());
  try {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/post/${id}/upvote`, userId, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(interactPostSuccess());
  } catch (err) {
    dispatch(interactPostFailed());
  }
};

export const downvotePost = async (dispatch, token, id, userId) => {
  dispatch(interactPostStart());
  try {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/post/${id}/downvote`, userId, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(interactPostSuccess());
  } catch (err) {
    dispatch(interactPostFailed());
  }
};

//COMMENT
export const addComment = async (dispatch, token, id, comment) => {
  dispatch(addCommentStart());
  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/post/comment/${id}`, comment, {
      headers: { token: `Bearer ${token}` },
    });
    dispatch(addCommentSuccess());
  } catch (err) {
    dispatch(addCommentFailed());
  }
};

export const deleteUserComment = async (
  dispatch,
  token,
  id,
  ownerId,
  setDeletedCommentId,
  comment
) => {
  dispatch(deleteCommentStart());
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/post/comment/${id}`, {
      headers: { token: `Bearer ${token}` },
      data: { ownerId: ownerId },
    });
    setDeletedCommentId([...comment, id]);
    dispatch(deleteCommentSuccess());
  } catch (err) {
    dispatch(deleteCommentFailed());
  }
};
