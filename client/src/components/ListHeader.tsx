import Modal from "./Modal";
import { useState } from "react";
import { useCookies } from "react-cookie";
import React from 'react';

interface ListHeaderProps {
	listName: string;
	getData: () => void;
}

const ListHeader: React.FC<ListHeaderProps> = ({ listName, getData }) => {
	const [cookies, setCookie, removeCookie] = useCookies<string>([]); // eslint-disable-next-line
	const [showModal, setShowModal] = useState(false);

	const singOut = () => {
		console.log('signout');
		removeCookie('Email');
		removeCookie('AuthToken');
		window.location.reload();
	};

	return (
		<div className="list-header">
			<h1>{listName}</h1>
			<div className="button-container">
				<button className="create" onClick={() => setShowModal(true)}>ADD NEW</button>
				<button className="signout" onClick={singOut}>SIGN OUT</button>
			</div>
			{showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData}/>}
		</div>
	);
};

export default ListHeader;
