import React, { Component } from 'react';

export const CustomOption = ({ value, label, description }) => (
	<div className="custom-option">
		<div>{label}</div>
		<span>-</span>
		<div className="custom-option-description">{description}</div>
	</div>
);

export const filterOptions = (candidate, input) => {
	if (input) {
		let _text = (candidate.label + candidate.data.description).toLowerCase();
		return _text.includes(input.toLowerCase());
	}
	return true;
};
