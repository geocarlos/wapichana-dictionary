import React, { useState } from 'react';
import './NewEntryForm.css';
import { useContext } from 'react';
import appContext from '../context/app-context';
import { getLetter } from '../functions/functions';

const GrammarForm = ({ setFormsOpen, entry, audios, images }) => {
	const [state, setState] = useState({
		gramm: ''
	});
	const { db } = useContext(appContext);

	const handleClose = () => {
		setFormsOpen(previous => ({...previous, gramm: false}));
	}

	const handleSubmit = event => {
		event.preventDefault();
		db.collection(getLetter(entry)).doc(entry).set({
			entry,
			audios,
			images,
			gramm: state.gramm
		}).then(result => {
			console.log(result);
			handleClose(false)
			window.localStorage.removeItem('@wordlist');
			window.location.reload();
		})
			.catch(error => console.log(error));
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
				<label htmlFor="definition">Classe gramatical para {entry}</label>
					<input value={state.gramm} onChange={e => setState({ gramm: e.target.value })} type="text" />
				</div>
				<button type="submit">Mudar classe gramatical</button>
				<button type="reset" onClick={handleClose}>Cancelar</button>
			</form>
		</div>
	)
}

export default GrammarForm;
