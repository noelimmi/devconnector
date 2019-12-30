import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { showModal } from "../../actions/modal";
import Moment from "react-moment";

const CommentItem = ({
	postId,
	comment: { _id, text, name, avatar, user, date },
	auth,
	showModal,
}) => {
	const onClick = (postId, commentId) => {
		const resourceId = {
			postId,
			commentId,
		};
		const resourceType = "comment";
		showModal(
			`Are you sure? You want to delete this ${resourceType}.`,
			resourceType,
			resourceId,
		);
	};
	return (
		<div class="post bg-white p-1 my-1">
			<div>
				<Link to={`/profile/${user}`}>
					<img class="round-img" src={avatar} alt="" />
					<h4>{name}</h4>
				</Link>
			</div>
			<div>
				<p class="my-1">{text}</p>
				<p class="post-date">
					Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
				</p>
				{!auth.loading && user === auth.user._id && (
					<button
						onClick={() => onClick(postId, _id)}
						type="button"
						className="btn btn-danger">
						<i className="fas fa-times"></i>
					</button>
				)}
			</div>
		</div>
	);
};

CommentItem.propTypes = {
	showModal: PropTypes.func.isRequired,
	postId: PropTypes.string.isRequired,
	comment: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { showModal })(CommentItem);
