import React, { useState } from 'react';
import './NewEntryForm.css';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';
import appContext from '../context/app-context';

const NewEntryForm = ({ handleClose }) => {
	const [state, setState] = useState({
		entry: '',
		gramm: ''
	});
	const history = useHistory();
	const { db } = useContext(appContext);

	const handleSubmit = event => {
		event.preventDefault();
		db.collection(state.entry[0].toUpperCase()).doc(state.entry).set({
			entry: state.entry,
			gramm: state.gramm,
			audios: [],
			images: []
		}).then(result => {
			console.log(result);
			history.push(`/entry-editor/${state.entry}`)
			handleClose(false)
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
					<label htmlFor="entry">Vocábulo em wapichana: </label>
					<input value={state.entry} onChange={e => setState({ ...state, entry: e.target.value })} type="text" />
				</div>
				<div className="field">
					<label htmlFor="gramm">Classe gramatical: </label>
					<input value={state.gramm} onChange={e => setState({ ...state, gramm: e.target.value })} type="text" />
				</div>
				<button type="submit">Criar Vocábulo</button>
				<button type="reset" onClick={handleClose}>Cancelar</button>
			</form>
		</div>
	)
}

export default NewEntryForm;
