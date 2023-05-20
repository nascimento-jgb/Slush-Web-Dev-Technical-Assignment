import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem"
import Auth from "./components/Auth"
import { useEffect, useState } from 'react'

function App() {
  const userEmail = 'joao@test.com'
  const [ tasks, setTasks] = useState(null)

  const authToken = false

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${ userEmail }`)
      const json = await response.json()
      console.log(json)
      setTasks(json)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() =>{
    if (authToken) {
      getData()
    }}, []) // eslint-disable-line react-hooks/exhaustive-deps

  console.log(tasks)

  //Sort by date
  const sortedTasks = tasks?.sort((a,b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="app">
      {!authToken && <Auth/>}
      {authToken &&
      <>
      <ListHeader listName= {' 💻 Project Cards Follow-Up '} getData={getData}/>
      {sortedTasks?.map((task) => <ListItem key = {task.id} task={task} getData={getData}/>)}
      </>}
    </div>
  );
}

export default App;
