const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");
const Profile = require("../models/Profile");

// @route  POST api/post
// @desc   Create a Post
// @access Private
router.post(
	"/",
	[
		auth,
		[
			check("text", "Text is required")
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id).select("-password");

			const newPost = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};
			const post = new Post(newPost);
			await post.save();
			res.json(post);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server error");
		}
	},
);

// @route  POST api/post
// @desc   Get all posts
// @access Private
router.get("/", auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
});

// @route  POST api/post/:post_id
// @desc   Get post by id
// @access Private
router.get("/:post_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.json(post);
	} catch (error) {
		console.error(error.message);
		if (error.kind == "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server error");
	}
});

// @route  DELETE api/post/:post_id
// @desc   delete post
// @access Private
router.delete("/:post_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}
		// Check if post owner and requested user are the same and
		// toString because its type of ObjectId so chaning to String
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "Not having permission to delete" });
		}
		await post.remove();
		res.json({ msg: "Post Removed" });
	} catch (error) {
		console.error(error.message);
		if (error.kind == "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server error");
	}
});

// @route  Put api/post/like/:post_id
// @desc   like a post
// @access Private
router.put("/like/:post_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}
		// Check if the post has already been liked
		if (
			post.likes.filter(like => like.user.toString() == req.user.id).length > 0
		) {
			return res
				.status(400)
				.json({ msg: "This post already been liked by you." });
		}
		// add a like
		post.likes.unshift({ user: req.user.id });
		await post.save();
		res.json(post.likes);
	} catch (error) {
		console.error(error.message);
		if (error.kind == "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server error");
	}
});

// @route  Put api/post/unlike/:post_id
// @desc   unlike a post
// @access Private
router.put("/unlike/:post_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}
		// Check if the post has not been liked
		if (
			post.likes.filter(like => like.user.toString() == req.user.id).length == 0
		) {
			return res.status(400).json({ msg: "Post has not yet been liked." });
		}
		// remove a like
		post.likes = post.likes.filter(like => like.user.toString() != req.user.id);
		await post.save();
		res.json(post.likes);
	} catch (error) {
		console.error(error.message);
		if (error.kind == "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server error");
	}
});

// @route  POST api/post/comment/:post_id
// @desc   Create a comment for a post
// @access Private
router.post(
	"/comment/:post_id",
	[
		auth,
		[
			check("text", "Text is required")
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id).select("-password");
			const post = await Post.findById(req.params.post_id);

			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};

			post.comments.unshift(newComment);

			post.save();

			res.json(post.comments);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server error");
		}
	},
);

// @route  Delete api/post/comment/:post_id/:comment_id
// @desc   delete a comment for a post
// @access Private
router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);
		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}
		const comment = post.comments.find(
			comment => comment.id == req.params.comment_id,
		);

		// Make sure comment exist
		if (!comment) {
			return res.status(404).json({ msg: "Comment does not exist" });
		}

		//check permission
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "Not having permission to delete" });
		}
		post.comments = post.comments.filter(
			comment => comment.id != req.params.comment_id,
		);
		await post.save();
		res.json(post.comments);
	} catch (error) {
		console.error(error.message);
		if (error.kind == "ObjectId") {
			return res.status(404).json({ msg: "Post not found" });
		}
		res.status(500).send("Server error");
	}
});
module.exports = router;
