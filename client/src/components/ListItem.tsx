import { useState } from 'react';
import TickIcon from './TickIcon';
import ProgressBar from './ProgressBar';
import Modal from './Modal';
import React from 'react';

interface ListItemProps {
	task: {
		id: string;
		type: string;
		title: string;
		progress: number;
	};
	getData: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ task, getData }) => {
	const [showModal, setShowModal] = useState(false);

	const deleteItem = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
				method: 'DELETE'
			});
			if (response.status === 200) {
				getData();
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="list-item">
			<div className="info-container">
				{task.type === 'done' && <TickIcon />}
				<p className="task-title">{task.title}</p>
				{task.type === 'ongoing' && <br />}
				{task.type === 'ongoing' && <ProgressBar progress={task.progress} />}
				{task.type === 'ongoing' && <br />}
				<div className="button-container">
					<button className="edit" onClick={() => setShowModal(true)}>EDIT</button>
					<button className="delete" onClick={deleteItem}>DELETE</button>
				</div>
			</div>
			{showModal && <Modal mode="edit" setShowModal={setShowModal} getData={getData} task={task} />}
		</div>
	);
};

export default ListItem;
