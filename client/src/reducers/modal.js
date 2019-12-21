import { OPEN_MODAL, CLOSE_MODAL } from "../actions/types";

const initialState = {
	isModalOpen: false,
	modalContent: null,
	resourceType: null,
	resourceId: null,
};

export default function(state = initialState, action) {
	const { type, modalContent, resourceType, resourceId } = action;
	switch (type) {
		case OPEN_MODAL: {
			return {
				isModalOpen: true,
				modalContent,
				resourceType,
				resourceId,
			};
		}
		case CLOSE_MODAL: {
			return {
				isModalOpen: false,
				modalContent: null,
				resourceType: null,
				resourceId: null,
			};
		}
		default:
			return state;
	}
}
