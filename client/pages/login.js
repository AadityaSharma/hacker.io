import { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import Link from 'next/link';
import Router from 'next/router';

const Login = () => {
	const [state, setState] = useState({
		email: '',
		password: '',
		error: '',
		success: '',
		buttonText: 'Login',
	});

	const { name, email, password, error, success, buttonText } = state;

	const handleChange = (name) => (event) => {
		setState({
			...state,
			[name]: event.target.value,
			error: '',
			success: '',
			buttonText: 'Login',
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.table({ email, password });

		setState({ ...state, buttonText: 'Logging in' });

		try {
			const response = await axios.post(`${API}/login`, {
				email,
				password,
			});
		} catch (error) {
			console.log(error);
			setState({
				...state,
				buttonText: 'Login',
				error: error.response.data.error,
			});
		}
	};

	const loginForm = () => (
		<form onSubmit={handleSubmit}>
			<div className='form-group'>
				<input
					value={email}
					onChange={handleChange('email')}
					type='email'
					className='form-control'
					placeholder='Type your email'
					required
				/>
			</div>
			<div className='form-group'>
				<input
					value={password}
					onChange={handleChange('password')}
					type='password'
					className='form-control'
					placeholder='Type your password'
					required
				/>
			</div>
			<div className='form-group'>
				<button type='submit' className='btn btn-outline-warning'>
					{buttonText}
				</button>
			</div>
		</form>
	);

	return (
		<Layout>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className='col-md-6 offset-md-3'>
				<h1>Login</h1>
				<br />
				{loginForm()}
				<br />
				{JSON.stringify(state)}
			</div>
		</Layout>
	);
};

export default Login;
