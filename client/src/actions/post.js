import axios from "axios";
import { setAlert } from "./alert";
import {
	GET_POSTS,
	POST_ERROR,
	UPDATE_LIKE,
	DELETE_POST,
	ADD_POST,
	GET_POST,
	ADD_COMMENT,
	REMOVE_COMMENT,
} from "./types";

//GET Posts
export const getPosts = () => async dispatch => {
	try {
		const res = await axios.get("/api/post");
		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

//Add Like
export const addLike = postId => async dispatch => {
	try {
		const res = await axios.put(`/api/post/like/${postId}`);
		dispatch({
			type: UPDATE_LIKE,
			payload: { postId, likes: res.data },
		});
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

//remove Like
export const removeLike = postId => async dispatch => {
	try {
		const res = await axios.put(`/api/post/unlike/${postId}`);
		dispatch({
			type: UPDATE_LIKE,
			payload: { postId, likes: res.data },
		});
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

//Delete Post
export const deletePost = postId => async dispatch => {
	try {
		await axios.delete(`/api/post/${postId}`);
		dispatch({
			type: DELETE_POST,
			payload: { postId },
		});

		dispatch(setAlert("Post has been Deleted.", "danger"));
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

//Add Post
export const addPost = formData => async dispatch => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	try {
		const res = await axios.post("/api/post", formData, config);
		dispatch({
			type: ADD_POST,
			payload: res.data,
		});

		dispatch(setAlert("Post has been Created.", "success"));
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

//GET Single Post
export const getPost = postId => async dispatch => {
	try {
		const res = await axios.get(`/api/post/${postId}`);
		dispatch({
			type: GET_POST,
			payload: res.data,
		});
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

//Add Comment
export const addComment = (postId, formData) => async dispatch => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	try {
		const res = await axios.post(
			`/api/post/comment/${postId}`,
			formData,
			config,
		);
		dispatch({
			type: ADD_COMMENT,
			payload: res.data,
		});

		dispatch(setAlert("Comment Added.", "success"));
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

//Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {
	try {
		await axios.delete(`/api/post/comment/${postId}/${commentId}`);
		dispatch({
			type: REMOVE_COMMENT,
			payload: { commentId },
		});

		dispatch(setAlert("Comment Removed.", "success"));
	} catch (error) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};
