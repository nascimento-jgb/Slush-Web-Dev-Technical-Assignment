const PORT = process.env.PORT ?? 8000
const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./db')
const { v4: uuidv4 } = require('uuid')

app.use(cors())
app.use(express.json())

// Get all todos
app.get('/todos/:userEmail', async (req, res) => {

	const { userEmail } = req.params
	console.log({userEmail})
	try {
		const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail])
		res.json(todos.rows)
	} catch (err) {
		console.log(err)
	}
})

// Create a new todo
app.post('/todos', async (req, res) => {
	const {user_email, title, progress, date} = req.body
	console.log(user_email, title, progress, date)
	const id = uuidv4()
	try {
		const newCard = await pool.query(`INSERT INTO todos(id, user_email, title, progress, data) VALUES($1, $2, $3, $4, $5)`,
		[id, user_email, title, progress, date])
		res.json(newCard)
	} catch (err) {
		console.error(err)
	}
})

// Edit a todo
app.put('/todos/:id', async (req, res) => {
	const {id} = req.params
	const {user_email, title, progress, date} = req.body
	try {
		const editCard = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, data = $4 WHERE id = $5;',
		[user_email, title, progress, date, id])
		res.json(editCard)
	} catch (err) {
		console.error(err)
	}

})

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
	const { id } = req.params

	try {
		const deleteCard = await pool.query('DELETE FROM todos WHERE id = $1', [id])
		res.json(deleteCard)
	} catch (err) {
		console.error(err)
	}
})

// Signup
app.post('/signup', async (req,res) => {
	const { email, password } = req.body

	try {

	} catch (err){
		console.error(err)
	}
})

// Login
app.post('/login', async (req,res) => {
	const { email, password } = req.body

	try {

	} catch (err){
		console.error(err)
	}
})

app.listen(PORT, ()=> console.log(`Server runing on PORT ${PORT}`))
