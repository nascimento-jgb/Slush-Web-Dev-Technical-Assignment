import React, { useEffect, useState } from 'react';
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useCookies } from 'react-cookie';


function App() {
	const [cookies, setCookie, removeCookie] = useCookies<string>([]);
	const authToken = cookies.AuthToken;
	const userEmail = cookies.Email;
	const [tasksToDo, setTasksToDo] = useState<any>([]);
	const [tasksOngoing, setTasksOngoing] = useState<any>([]);
	const [tasksDone, setTasksDone] = useState<any>([]);

	const getData = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`);
			const json = await response.json();
			console.log('fetched tasks', json);
			const tasks = json || [];

			const tasksToDo = tasks.filter((task: any) => task.type === 'todo');
			const tasksOngoing = tasks.filter((task: any) => task.type === 'ongoing');
			const tasksDone = tasks.filter((task: any) => task.type === 'done');

			setTasksToDo(tasksToDo);
			setTasksOngoing(tasksOngoing);
			setTasksDone(tasksDone);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (authToken) {
			getData();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const sortedTasksToDo = tasksToDo.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
	const sortedTasksOngoing = tasksOngoing.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
	const sortedTasksDone = tasksDone.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());

	return (
		<div className="app">
			{!authToken && <Auth />}
			{authToken && (
				<>
					<ListHeader listName="💻 PROJECT FOLLOW-UP CARDS" getData={getData} />
					<p className="user-email">Welcome back {userEmail}!</p>

					<div className="columns-container">
						<div className="column">
							<h2>TODO</h2>
							<ul>
								{sortedTasksToDo.map((task: any) => (
									<ListItem key={task.id} task={task} getData={getData} />
								))}
							</ul>
						</div>

						<div className="column">
							<h2>ONGOING</h2>
							<ul>
								{sortedTasksOngoing.map((task: any) => (
									<ListItem key={task.id} task={task} getData={getData} />
								))}
							</ul>
						</div>

						<div className="column">
							<h2>DONE</h2>
							<ul>
								{sortedTasksDone.map((task: any) => (
									<ListItem key={task.id} task={task} getData={getData} />
								))}
							</ul>
						</div>
					</div>
				</>
			)}
			<p className="copyright">© Creative Coding Joao Nascimento</p>
		</div>
	);
}

export default App;
