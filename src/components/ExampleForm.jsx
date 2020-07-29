import React, { useState } from 'react';
import './NewEntryForm.css';
import { useContext } from 'react';
import appContext from '../context/app-context';
import { getLetter } from '../functions/functions';

const ExampleForm = ({ setFormsOpen, entry, definition, index, setEntry }) => {
	const [state, setState] = useState({
		example: '',
		exampleTranslation: ''
	});
	const { db } = useContext(appContext);

	const handleClose = () => {
		setFormsOpen(previous => ({...previous, example: false}));
	}

	const handleSubmit = event => {
		event.preventDefault();
		db.collection(getLetter(entry)).doc(entry).collection('definitions').doc(definition).collection('examples').doc(index).set({
			example: state.example,
			exampleTranslation: state.exampleTranslation
		}).then(result => {
			handleClose(false);
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
					<label htmlFor="example">Exemplo para {entry}</label>
					<input value={state.example} onChange={e => setState({ ...state, example: e.target.value })} type="text" />
				</div>
				<div className="field">
					<label htmlFor="translation">Tradução</label>
					<input value={state.exampleTranslation} onChange={e => setState({ ...state, exampleTranslation: e.target.value })} type="text" />
				</div>
				<button type="submit">Adicionar exemplo</button>
				<button type="reset" onClick={handleClose}>Cancelar</button>
			</form>
		</div>
	)
}

export default ExampleForm;
