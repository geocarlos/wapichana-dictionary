import React, { useState } from 'react';
import './NewEntryForm.css';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import appContext from '../context/app-context';
import firebase from '../firebase';

const LoginForm = ({ handleClose }) => {
	const [state, setState] = useState({
		email: '',
		password: ''
	});
	const history = useHistory();
	const { db } = useContext(appContext);

	const handleSubmit = event => {
		event.preventDefault();
		firebase.auth().signInWithEmailAndPassword(state.email, state.password).then(result => {
			console.log('YOU ARE LOGGED IN.')
		}).catch(error => console.log('THERE WAS AN ERROR LOGGING YOU IN.'))
	}

	const handleClick = event => {
		if (event.target.className === 'entry-div') {
			handleClose();
		}
	}

	return (
		<div onClick={handleClick} className="entry-div">
			<form className="entry-form" onSubmit={handleSubmit}>
				<div className="field">
					<label htmlFor="email">E-mail: </label>
					<input type="email" value={state.email} onChange={e => setState({ ...state, email: e.target.value })} />
				</div>
				<div className="field">
					<label htmlFor="password">Senha: </label>
					<input type="password" value={state.password} onChange={e => setState({ ...state, password: e.target.value })} />
				</div>
				<button type="submit">Fazer login</button>
				<button type="reset" onClick={handleClose}>Cancelar</button>
			</form>
		</div>
	)
}

export default LoginForm;
