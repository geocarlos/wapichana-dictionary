import React, { useState } from 'react';
import './NewEntryForm.css';
import { useContext } from 'react';
import appContext from '../context/app-context';
import { getLetter } from '../functions/functions';

const DefinitionForm = ({ setFormsOpen, entry, index }) => {
	const [state, setState] = useState({
		definition: ''
	});
	const { db } = useContext(appContext);

	const handleClose = () => {
		setFormsOpen(previous => ({...previous, definition: false}));
	}

	const handleSubmit = event => {
		event.preventDefault();
		db.collection(getLetter(entry)).doc(entry).collection('definitions').doc(index).set({
			definition: state.definition
		}).then(result => {
			console.log(result);
			handleClose(false)
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
				<label htmlFor="definition">Definição para {entry}</label>
					<input value={state.definition} onChange={e => setState({ definition: e.target.value })} type="text" />
				</div>
				<button type="submit">Adicionar definição</button>
				<button type="reset" onClick={handleClose}>Cancelar</button>
			</form>
		</div>
	)
}

export default DefinitionForm;
