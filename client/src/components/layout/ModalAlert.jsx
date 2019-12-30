import React from "react";
import PropTypes from "prop-types";
import { closeModal } from "../../actions/modal";
import {
	deleteExperience,
	deleteEducation,
	deleteAccount,
} from "../../actions/profile";
import { deletePost, deleteComment } from "../../actions/post";
import { connect } from "react-redux";

const ModalAlert = ({
	isModalOpen,
	modalContent,
	resourceType,
	resourceId,
	closeModal,
	deleteAccount,
	deleteEducation,
	deleteExperience,
	deletePost,
	deleteComment,
}) => {
	const onAction = () => {
		switch (resourceType) {
			case "experience": {
				deleteExperience(resourceId);
				break;
			}
			case "education": {
				deleteEducation(resourceId);
				break;
			}
			case "account": {
				deleteAccount();
				break;
			}
			case "post": {
				deletePost(resourceId);
				break;
			}
			case "comment": {
				deleteComment(resourceId.postId, resourceId.commentId);
				break;
			}
			default:
		}
		closeModal();
	};
	if (!isModalOpen) {
		return null;
	}
	let getVisible = { display: "block" };
	return (
		<div className="modal-container" style={getVisible}>
			<div className="modal">
				<div className="modalContent">
					<p>{modalContent}</p>
					<button className="btn btn-danger" onClick={() => onAction()}>
						Yes
					</button>
					<button className="btn btn-primary" onClick={() => closeModal()}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

ModalAlert.propTypes = {
	closeModal: PropTypes.func.isRequired,
	deleteEducation: PropTypes.func.isRequired,
	deleteExperience: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	deletePost: PropTypes.func.isRequired,
	deleteComment: PropTypes.func.isRequired,
	isModalOpen: PropTypes.bool.isRequired,
	modalContent: PropTypes.string,
	resourceType: PropTypes.string,
	resourceId: PropTypes.any,
};

const mapStateToProps = state => ({
	isModalOpen: state.modal.isModalOpen,
	modalContent: state.modal.modalContent,
	resourceType: state.modal.resourceType,
	resourceId: state.modal.resourceId,
});

export default connect(mapStateToProps, {
	closeModal,
	deleteComment,
	deletePost,
	deleteExperience,
	deleteEducation,
	deleteAccount,
})(ModalAlert);
