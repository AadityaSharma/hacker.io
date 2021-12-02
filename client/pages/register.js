import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { isAuth } from '../helpers/auth';
import Router from 'next/router';

const Register = () => {
	const [state, setState] = useState({
		name: '',
		email: '',
		password: '',
		error: '',
		success: '',
		buttonText: 'Register',
	});

	useEffect(() => {
		isAuth() && Router.push('/');
	}, []);

	const { name, email, password, error, success, buttonText } = state;

	const handleChange = (name) => (event) => {
		setState({
			...state,
			[name]: event.target.value,
			error: '',
			success: '',
			buttonText: 'Register',
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.table({ name, email, password });

		setState({ ...state, buttonText: 'Registering' });

		try {
			const response = await axios.post(`${API}/register`, {
				name,
				email,
				password,
			});
			setState({
				...state,
				name: '',
				email: '',
				password: '',
				buttonText: 'Submitted',
				success: response.data.message,
			});
		} catch (error) {
			console.log(error);
			setState({
				...state,
				buttonText: 'Register',
				error: error.response.data.error,
			});
		}
	};

	const registerForm = () => (
		<form onSubmit={handleSubmit}>
			<div className='form-group'>
				<input
					value={name}
					onChange={handleChange('name')}
					type='text'
					className='form-control'
					placeholder='Type your name'
					required
				/>
			</div>
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
				<h1>Register</h1>
				<br />
				{registerForm()}
				<br />
				{JSON.stringify(state)}
			</div>
		</Layout>
	);
};

export default Register;
