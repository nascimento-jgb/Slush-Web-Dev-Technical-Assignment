import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db';

const PORT: number = 8000;
const app: express.Application = express();

app.use(cors())
app.use(express.json())

interface Todo {
	id: string;
	user_email: string;
	title: string;
	progress: string;
	type: string;
	date: string;
}

interface SignupData {
	email: string;
	password: string;
}

interface LoginData {
	email: string;
	password: string;
}


// Get all todos
app.get('/todos/:userEmail', async (req: express.Request, res: express.Response) => {
	const userEmail: string = req.params.userEmail;
	try {
		const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail]);
		console.log('Retrieved todos:', todos.rows);
		res.json(todos.rows);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});


// Create a new todo
app.post('/todos', async (req: express.Request, res: express.Response) => {
	const { user_email, title, progress, type, date }: Todo = req.body;
	const id: string = uuidv4();
	try {
		const newCard = await pool.query(
			'INSERT INTO todos(id, user_email, title, progress, type, date) VALUES($1, $2, $3, $4, $5, $6)',
			[id, user_email, title, progress, type, date]
		);
		console.log('Created new todo:', newCard.rows);
		res.json(newCard);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Edit a todo
app.put('/todos/:id', async (req: express.Request, res: express.Response) => {
	const { id } = req.params;
	const { user_email, title, progress, type, date }: Todo = req.body;
	try {
		const editCard = await pool.query(
			'UPDATE todos SET user_email = $1, title = $2, progress = $3, type = $4, date = $5 WHERE id = $6',
			[user_email, title, progress, type, date, id]
		);
		console.log('Updated todo:', editCard.rows);
		res.json(editCard);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Delete a todo
app.delete('/todos/:id', async (req: express.Request, res: express.Response) => {
	const { id } = req.params;
	try {
		const deleteCard = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
		console.log('Deleted todo:', deleteCard.rows);
		res.json(deleteCard);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Signup
app.post('/signup', async (req: express.Request, res: express.Response) => {
	const { email, password }: SignupData = req.body;
	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = bcrypt.hashSync(password, salt);

	try {
		const signUp = await pool.query('INSERT INTO users (email, hashed_password) VALUES($1, $2)', [
			email,
			hashedPassword,
		]);

		const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
		res.json({ email, token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Login
app.post('/login', async (req: express.Request, res: express.Response) => {
	const { email, password }: LoginData = req.body;

	try {
	  const users = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

	  if (!users.rows.length) return res.status(401).json({ detail: 'User does not exist' });

	  const success = await bcrypt.compare(password, users.rows[0].hashed_password);
	  const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

	  if (success) {
		res.json({ email: users.rows[0].email, token });
	  } else {
		res.status(401).json({ detail: 'Login attempt failed!' });
	  }
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
