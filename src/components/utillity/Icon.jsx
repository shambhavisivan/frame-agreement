/* PROPERTIES
+-----------+-----------+---------+-------------------------------------------------+----------+
| Property  | Data Type | Default |                   Description                   | Optional |
+-----------+-----------+---------+-------------------------------------------------+----------+
| name      | String    | N/A     | Name of the icon for selecting purposes         | false    |
| unit      | String    | 'px'    | Unit of width and height to be assigned to icon | true     |
| width     | Integer   | 16      | Icon's width                                    | true     |
| height    | Integer   | 16      | Icon's width                                    | true     |
| color     | String    | #706e6b | Icon's color                                    | true     |
| svg-class | String    | ''      | Class to be added to svg element                | true     |
+-----------+-----------+---------+-------------------------------------------------+----------+
*/

import React from 'react';
import '../../icons.svg';

const Icon = props => {
	function isDefined(prop) {
		return typeof props[prop] !== 'undefined';
	}

	let style = {};
	let unit = 'px';

	if (isDefined('unit')) {
		unit = props.unit;
	}

	if (isDefined('color')) {
		style.fill = props.color;
	} else {
		style.fill = '#706e6b';
	}

	if (isDefined('width')) {
		style.width = props.width + unit;
	} else {
		style.width = 16 + unit;
	}

	if (isDefined('height')) {
		style.height = props.height + unit;
	} else {
		style.height = style.width || 16 + unit;
	}

	return (
		<svg
			style={style}
			className={`icon icon-${props.name} ${props['svg-class'] || ''}`}
			aria-hidden="true"
		>
			<use xlinkHref={`#icons_${props.name}`} />
		</svg>
	);
};

export default Icon;
