import { useState } from 'react'
import { useCookies } from 'react-cookie'

const Auth = () => {
	const [cookies, setCookie, removeCookie] = useCookies(null)
	const [isLogIn, setIsLogin] = useState(true)
	const [email, setEmail] = useState(null)
	const [password, setPassword] = useState(null)
	const [confirmPassword, setConfirmPassword] = useState(null)
	const [error, setError] = useState(null)

	const viewLogin = (status) => {
		setError(null)
		setIsLogin(status)
	}

	const handleSubmit = async (e, endpoint) => {
		e.preventDefault()
		if (!isLogIn && password !== confirmPassword) {
			setError('Invalid password confirmation!')
			return
		}

	const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
			method: 'POST',
			headers: {'Content-Type' : 'application/json'},
			body: JSON.stringify({email, password})
		})

	const info = await response.json()

	if (info.detail) {
		setError(info.detail)
	} else {
		setCookie('Email', info.email)
		setCookie('AuthToken', info.token)
		window.location.reload()
	}
	}

	return (
	  <div className="auth-container">
		<div className="auth-container-box">
			<form>
				<h2>{isLogIn ? 'Go ahead and log in:' : 'Please sign up!'}</h2>
				<input
					type="email"
					placeholder="email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				{!isLogIn && <input
					type="password"
					placeholder="confirm password"
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>}
				<input type="submit"
				className="create" onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}
				style={{backgroundColor: 'rgb(255, 255, 255)', color: ' rgb(255, 183, 3)', font: 'bold' }}/>
				{error && <p>{error}</p>}
			</form>

			<div className="auth-options">
				<button
					onClick={() => viewLogin(false)}
					style={{backgroundColor : !isLogIn ? 'rgb(255, 255, 255)' : 'rgb(2, 48, 71)'}}
				>
					Sign Up</button>
				<button
					onClick={() => viewLogin(true)}
					style={{backgroundColor : isLogIn ? 'rgb(255, 255, 255)' : 'rgb(2, 48, 71)'}}
				>
					Log In</button>
			</div>

		</div>
	  </div>
	);
  }

  export default Auth;
