import React, { Component } from 'react';

export const LookupSkeleton = props => {
	let skeletonStyle = {
		width: '120px',
		height: '16px'
	};

	let cellContainer = {
		flex: '1'
	};

	let skeletonRowStyle = {
		display: 'flex',
		width: '100%',
		borderRadius: '2px',
		background: 'white',
		boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.22)',
		justifyContent: 'space-between',
		marginBottom: '6px',
		padding: '6px 12px'
	};

	let skeletonContainerStyle = {
		display: 'flex',
		flexDirection: 'column',
		padding: '16px',
		background: '#f2f3f3',
		maxHeight: '20rem',
		overflowY: 'auto'
	};

	const _arr = Array(10).fill(10);

	return (
		<div className="skeleton-table-item" style={skeletonContainerStyle}>
			{_arr.map((c, i) => (
				<div
					key={c + '' + i}
					className="skeleton-table-item"
					style={skeletonRowStyle}
				>
					{props.cells.map(cc => (
						<div key={cc} style={cellContainer}>
							<div className="skeleton-shape" style={skeletonStyle} />
						</div>
					))}
				</div>
			))}
		</div>
	);
};
