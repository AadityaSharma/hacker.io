import { useState, useEffect } from 'react';
import axios from 'axios';
import {
	showSuccessMessage,
	showErrorMessage,
} from '../../../../helpers/alerts';
import { API } from '../../../../config';
import Router, { withRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import jwt from 'jsonwebtoken';

const ResetPassword = ({ router }) => {
	const [state, setState] = useState({
		name: '',
		token: '',
		newPassword: '',
		buttonText: 'Reset Password',
		success: '',
		error: '',
	});

	const { name, token, newPassword, buttonText, success, error } = state;

	useEffect(() => {
		console.log(router);
		const decoded = jwt.decode(router.query.id);
		if (decoded) {
			setState({ ...state, name: decoded.name, token: router.query.id });
		}
	}, [router]);

	const handleChange = (e) => {
		setState({
			...state,
			newPassword: e.target.value,
			success: '',
			error: '',
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log('Post email to', email);
		setState({
			...state,
			buttonText: 'Sending',
		});

		try {
			const response = await axios.put(`${API}/reset-password`, {
				resetPasswordLink: token,
				newPassword,
			});
			// console.log('RESET PASSWORD', response);
			setState({
				...state,
				newPassword: '',
				buttonText: 'Done',
				success: response.data.message,
			});
		} catch (error) {
			console.log('RESET PASSWORD ERROR', error);
			setState({
				...state,
				buttonText: 'Reset Password',
				error: error.response.data.error,
			});
		}
	};

	const forgotPasswordForm = () => (
		<form onSubmit={handleSubmit}>
			<div className='form-group'>
				<input
					type='text'
					className='form-control'
					value={newPassword}
					onChange={handleChange}
					placeholder='Enter new password'
					required
				/>
			</div>
			<div className='form-group'>
				<button className='btn btn-outline-warning'>{buttonText}</button>
			</div>
		</form>
	);

	return (
		<Layout>
			<div className='row'>
				<div className='col-md-6 offset-md-3'>
					<h1>Hi {name}, Ready to Reset your password?</h1>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{forgotPasswordForm()}
				</div>
			</div>
		</Layout>
	);
};

export default withRouter(ResetPassword);
