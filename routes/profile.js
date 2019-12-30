const express = require("express");
const axios = require("axios");
const config = require("config");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Post = require("../models/Post");

// @route  GET api/profile/me
// @desc   Get logged In user profile
// @access Private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "avatar"]);
		if (!profile) {
			return res
				.status(400)
				.json({ msg: "There is no profile associated with this user." });
		}
		res.status(200).json(profile);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Server error");
	}
});

// @route  POST api/profile
// @desc   Create or Update user Profile
// @access Private
router.post(
	"/",
	[
		auth,
		[
			check("status", "Status is required")
				.not()
				.isEmpty(),
			check("skills", "Skills is required")
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin,
		} = req.body;

		//Build profile object
		const profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) {
			profileFields.bio = bio;
		}
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills.split(",").map(skill => skill.trim());
		}

		//Social
		profileFields.social = {};
		if (youtube) profileFields.social.youtube = youtube;
		if (twitter) profileFields.social.twitter = twitter;
		if (facebook) profileFields.social.facebook = facebook;
		if (linkedin) profileFields.social.linkedin = linkedin;
		if (instagram) profileFields.social.instagram = instagram;

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				//update
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true },
				);
				return res.json(profile);
			}
			//Create
			profile = new Profile(profileFields);
			await profile.save();
			console.log(profile);
			res.json(profile);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server Error");
		}
	},
);

// @route  GET api/profile
// @desc   get all profile
// @access Public
router.get("/", async (req, res) => {
	try {
		const profiles = await Profile.find().populate("user", ["name", "avatar"]);
		res.json(profiles);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// @route  GET api/profile/user/:user_id
// @desc   get profile by user id
// @access Public
router.get("/user/:user_id", async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate("user", ["name", "avatar"]);
		if (!profile) return res.status(404).json({ msg: "Profile Not Found." });
		res.json(profile);
	} catch (error) {
		console.error(error);
		if (error.kind == "ObjectId")
			return res.status(404).json({
				msg: "Profile Not Found.",
			});
		res.status(500).send("Server Error");
	}
});

// @route  DELETE api/profile
// @desc   Delete profile user and post
// @access Private
router.delete("/", auth, async (req, res) => {
	try {
		//remove post associated with account.
		await Post.deleteMany({ user: req.user.id });
		//remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		//remove user
		await User.findOneAndRemove({ id: req.user.id });
		res.json({ msg: "User Deleted" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// @route  PUT api/profile/experiance
// @desc   ADD Experiance
// @access Private
router.put(
	"/experience",
	[
		auth,
		check("title", "Title is required")
			.not()
			.isEmpty(),
		check("company", "Company is required")
			.not()
			.isEmpty(),
		check("from", "From date is required")
			.not()
			.isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		} = req.body;
		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });
			profile.experience.unshift(newExp);
			await profile.save();
			res.json(profile);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server Error");
		}
	},
);

// @route  PUT api/profile/experiance/:exp_id
// @desc   Delete Experiance
// @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		const updatedExp = profile.experience.filter(
			item => item.id != req.params.exp_id,
		);
		profile.experience = updatedExp;
		await profile.save();
		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// @route  PUT api/profile/education
// @desc   ADD education
// @access Private
router.put(
	"/education",
	[
		auth,
		check("school", "School is required")
			.not()
			.isEmpty(),
		check("degree", "Degree is required")
			.not()
			.isEmpty(),
		check("from", "From date is required")
			.not()
			.isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		} = req.body;
		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });
			profile.education.unshift(newEdu);
			await profile.save();
			res.json(profile);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server Error");
		}
	},
);

// @route  PUT api/profile/education/:exp_id
// @desc   Delete education
// @access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		const updatedEdu = profile.education.filter(
			item => item.id != req.params.edu_id,
		);
		profile.education = updatedEdu;
		await profile.save();
		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

// @route  GET api/profile/github/:username
// @desc   get list of repo availalble to user
// @access Public
router.get("/github/:username", async (req, res) => {
	try {
		const url = `https://api.github.com/users/${
			req.params.username
		}/repos?per_page=5&sort=created:asc&client_id=${config.get(
			"github.clientID",
		)}&client_secret=${config.get("github.clientSecret")}`;

		const repo = await axios({
			method: "get",
			url,
			headers: {
				"user-agent": "node.js",
			},
		});
		const { data } = repo;
		if (data.length == 0)
			return res.status(404).json({ error: "No repositary found" });
		res.json(repo.data);
	} catch (error) {
		console.log(error.message);

		if (error.response.status == 404)
			return res.status(404).json({ error: "No github profile found" });
		res.status(500).send("Server Error");
	}
});

module.exports = router;
