import { useState } from 'react';
import { useCookies } from 'react-cookie';
import React from 'react';

interface ModalProps {
	mode: 'create' | 'edit';
	setShowModal: (show: boolean) => void;
	getData: () => void;
	task?: {
		id: string;
		user_email: string;
		title: string;
		progress: number;
		type: string;
		date: Date;
	};
}

const Modal: React.FC<ModalProps> = ({ mode, setShowModal, getData, task }) => {
	const [cookies, setCookie, removeCookie] = useCookies<string>([]);
	const editMode = mode === 'edit' ? true : false;

	const [data, setData] = useState({
		user_email: editMode ? task?.user_email : cookies.Email,
		title: editMode ? task?.title : '',
		progress: editMode ? task?.progress : 50,
		type: editMode ? task?.type : '',
		date: editMode ? task?.date : new Date(),
	});

	const postData = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			console.log('Retrieved data:', response);
			if (response.status === 200) {
				console.log('WORKED');
				setShowModal(false);
				getData();
			}
		} catch (err) {
			console.error(err);
		}
	};

	const editData = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task?.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			console.log('Updated data:', response);
			if (response.status === 200) {
				console.log('edition worked');
				setShowModal(false);
				getData();
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;

		setData((data) => ({
			...data,
			[name]: value,
		}));
	};

	return (
		<div className="overlay">
			<div className="modal">
				<div className="form-title-container">
					<h3>Time to {mode} a task card!</h3>
					<button onClick={() => setShowModal(false)}>X</button>
				</div>

				<form onSubmit={editMode ? editData : postData}>
					<input
						required
						maxLength={30}
						placeholder="Your task goes here"
						name="title"
						value={data.title}
						onChange={handleChange}
					/>
					<br />
					<label htmlFor="range">Drag to set your current progress:</label>
					<input
						required
						type="range"
						id="range"
						min="0"
						max="100"
						step={1}
						name="progress"
						value={data.progress}
						onChange={handleChange}
					/>
					<label htmlFor="type">Select task type:</label>
					<select id="type" name="type" value={data.type} onChange={handleChange}>
						<option value="">Select type</option>
						<option value="todo">To Do</option>
						<option value="ongoing">Ongoing</option>
						<option value="done">Done</option>
					</select>
					<input className={mode} type="submit" />
				</form>
			</div>
		</div>
	);
};

export default Modal;
