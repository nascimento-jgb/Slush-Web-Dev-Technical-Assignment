import { useState } from 'react';
import { useCookies } from 'react-cookie';
import React from 'react';
import { MouseEvent } from 'react';

interface AuthInfo {
	email: string;
	token: string;
	detail?: string;
}

const Auth = () => {
	const [cookies, setCookie, removeCookie] = useCookies<string>([]);
	const [isLogIn, setIsLogin] = useState<boolean>(true);
	const [email, setEmail] = useState<string | null>(null);
	const [password, setPassword] = useState<string | null>(null);
	const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const viewLogin = (status: boolean) => {
		setError(null);
		setIsLogin(status);
	};

	const handleSubmit = async (e: React.MouseEvent<HTMLInputElement>, endpoint: string) => {
		e.preventDefault();
		if (!isLogIn && password !== confirmPassword) {
			setError('Invalid password confirmation!');
			return;
		}

		const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		const info: AuthInfo = await response.json();

		if (info.detail) {
			setError(info.detail);
		} else {
			setCookie('Email', info.email);
			setCookie('AuthToken', info.token);
			window.location.reload();
		}
	};

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
					{!isLogIn && (
						<input
							type="password"
							placeholder="confirm password"
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					)}
					<input
						type="submit"
						className="create"
						onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}
						style={{ backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(255, 183, 3)', fontWeight: 'bold' }}
					/>
					{error && <p>{error}</p>}
				</form>

				<div className="auth-options">
					<button
						onClick={() => viewLogin(false)}
						style={{ backgroundColor: !isLogIn ? 'rgb(255, 255, 255)' : 'rgb(2, 48, 71)' }}
					>
						Sign Up
					</button>
					<button
						onClick={() => viewLogin(true)}
						style={{ backgroundColor: isLogIn ? 'rgb(255, 255, 255)' : 'rgb(2, 48, 71)' }}
					>
						Log In
					</button>
				</div>
			</div>
		</div>
	);
};

export default Auth;
