import ListHeader from "./components/ListHeader"
import ListItem from "./components/ListItem"
import Auth from "./components/Auth"
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [tasksToDo, setTasksToDo] = useState([]);
  const [tasksOngoing, setTasksOngoing] = useState([]);
  const [tasksDone, setTasksDone] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`)
      const json = await response.json()
      console.log('fetched tasks', json)
      const tasks = json || [];

      const tasksToDo = tasks.filter((task) => task.type === 'todo');
      const tasksOngoing = tasks.filter((task) => task.type === 'ongoing');
      const tasksDone = tasks.filter((task) => task.type === 'done');

      setTasksToDo(tasksToDo);
      setTasksOngoing(tasksOngoing);
      setTasksDone(tasksDone);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (authToken) {
      getData()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const sortedTasksToDo = tasksToDo.sort((a, b) => new Date(a.date) - new Date(b.date));
  const sortedTasksOngoing = tasksOngoing.sort((a, b) => new Date(a.date) - new Date(b.date));
  const sortedTasksDone = tasksDone.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="app">
      {!authToken && <Auth/>}
      {authToken && (
        <>
          <ListHeader listName="💻 Project Cards Follow-Up" getData={getData} />
          <p className="user-email">Welcome back {userEmail}!</p>

          <div className="columns-container">
            <div className="column">
              <h2>Tasks To Do</h2>
              <ul>
                {sortedTasksToDo.map((task) => (
                  <ListItem key={task.id} task={task} getData={getData} />
                ))}
              </ul>
            </div>

            <div className="column">
              <h2>Tasks Ongoing</h2>
              <ul>
                {sortedTasksOngoing.map((task) => (
                  <ListItem key={task.id} task={task} getData={getData} />
                ))}
              </ul>
            </div>

            <div className="column">
              <h2>Tasks Done</h2>
              <ul>
                {sortedTasksDone.map((task) => (
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
