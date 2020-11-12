import React from "react";

const Modal = (props) => {
	setTimeout(() => {
		props.closeModal();
	}, 3000);
	return props.message;
};

export default Modal;
