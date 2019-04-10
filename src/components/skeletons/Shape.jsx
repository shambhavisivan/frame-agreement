import React, { Component } from 'react';

import './Shape.scss';

const Shape = props => {
	function isDefined(prop) {
		return typeof props[prop] !== 'undefined';
	}

	let style = {};
	let unit = 'px';

	if (isDefined('unit')) {
		unit = props.unit;
	}

	if (isDefined('width')) {
		style.width = props.width + unit;
	}

	if (isDefined('height')) {
		style.height = props.height + unit;
	}

	return <div className="skeleton-shape" style={style} />;
};

export default Shape;
