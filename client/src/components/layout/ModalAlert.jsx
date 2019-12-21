import React from "react";
import PropTypes from "prop-types";
import { closeModal } from "../../actions/modal";
import {
	deleteExperience,
	deleteEducation,
	deleteAccount,
} from "../../actions/profile";
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
			default:
		}
		closeModal();
	};
	if (!isModalOpen) {
		return null;
	}
	return (
		<div className="modal-container">
			<div className="modal">
				<div className="modalContent">{modalContent}</div>
				<div className="modalActions">
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
	isModalOpen: PropTypes.bool.isRequired,
	modalContent: PropTypes.string,
	resourceType: PropTypes.string,
	resourceId: PropTypes.string,
};

const mapStateToProps = state => ({
	isModalOpen: state.modal.isModalOpen,
	modalContent: state.modal.modalContent,
	resourceType: state.modal.resourceType,
	resourceId: state.modal.resourceId,
});

export default connect(mapStateToProps, {
	closeModal,
	deleteExperience,
	deleteEducation,
	deleteAccount,
})(ModalAlert);
