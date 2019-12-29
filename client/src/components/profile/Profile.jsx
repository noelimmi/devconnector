import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import { Link } from "react-router-dom";
import ProfileTop from "./ProfileTop.jsx";
import ProfileAbout from "./ProfileAbout.jsx";
import ProfileExperience from "./ProfileExperience.jsx";
import ProfileEducation from "./ProfileEducation.jsx";
import ProfileGithub from "./ProfileGithub.jsx";

const Profile = ({
	getProfileById,
	profile: { profile, loading },
	auth,
	match: {
		params: { id },
	},
}) => {
	useEffect(() => {
		getProfileById(id);
	}, [getProfileById, id]);

	return (
		<Fragment>
			{profile === null || loading ? (
				<Spinner />
			) : (
				<Fragment>
					<Link to="/profiles" className="btn btn-light">
						Back to Devs List
					</Link>
					{auth.isAuthenticated &&
						auth.loading === false &&
						auth.user._id === profile.user._id && (
							<Link to="/edit-profile" className="btn btn-dark">
								Edit
							</Link>
						)}
					<div className="profile-grid my-1">
						<ProfileTop profile={profile} />
						<ProfileAbout profile={profile} />
						<div className="profile-exp bg-white p-2">
							<h2 className="text-primary">Experience</h2>
							{profile.experience.length > 0 ? (
								<Fragment>
									{profile.experience.map((experience, index) => (
										<ProfileExperience key={index} experience={experience} />
									))}
								</Fragment>
							) : (
								<h4>No experience credentials</h4>
							)}
						</div>
						<div className="profile-edu bg-white p-2">
							<h2 className="text-primary">Education</h2>
							{profile.education.length > 0 ? (
								<Fragment>
									{profile.education.map((education, index) => (
										<ProfileEducation key={index} education={education} />
									))}
								</Fragment>
							) : (
								<h4>No education credentials</h4>
							)}
						</div>
						{profile.githubusername && (
							<ProfileGithub username={profile.githubusername} />
						)}
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

Profile.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
