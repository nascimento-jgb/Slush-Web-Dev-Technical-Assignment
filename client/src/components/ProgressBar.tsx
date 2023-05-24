import React from 'react';

interface ProgressBarProps {
	progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
	const getColor = (progress: number): string => {
		const colors = [
			'rgb(174, 32, 18)',
			'rgb(187, 62, 3)',
			'rgb(251, 133, 0)',
			'rgb(253, 158, 2)',
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
