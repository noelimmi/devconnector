import { OPEN_MODAL, CLOSE_MODAL } from "./types";
export const showModal = (
	modalContent,
	resourceType,
	resourceId,
) => dispatch => {
	dispatch({ type: OPEN_MODAL, modalContent, resourceType, resourceId });
};
export const closeModal = () => dispatch => {
	dispatch({ type: CLOSE_MODAL });
};
