import React from 'react';

const ProgressBar = ({ progress }) => {
	const getColor = (progress) => {
		const colors = [
			'rgb(255, 214, 161)',
			'rgb(141, 181, 145)',
			'rgb(255, 175, 163)',
			'rgb(108, 115, 148)'
		];

		const index = Math.floor((progress - 1) / 25);
		return colors[index];
	};

	const color = getColor(progress);

	return (
		<div className="outer-bar">
			<div className="inner-bar" style={{ width: `${progress}%`, backgroundColor: color }}>
			<span className="percentage">{`${progress}%`}</span>
			</div>
		</div>
	);
};

export default ProgressBar;
