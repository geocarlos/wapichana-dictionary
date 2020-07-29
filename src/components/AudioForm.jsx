import React, { useState } from 'react';
import './NewEntryForm.css';
import { useContext } from 'react';
import appContext from '../context/app-context';
import { getLetter } from '../functions/functions';


const AudioForm = ({ setFormsOpen, entry, gramm, audios, images}) => {
	const [state, setState] = useState({
		audio: []
	});

	console.log(audios)

	const { db, storage } = useContext(appContext);

	const handleClose = () => {
		setFormsOpen(previous => ({...previous, audio: false}));
	}

	const handleSubmit = event => {
		event.preventDefault();
		if (state.audio.length !== 0) {
			console.log(event.target.file.files);
			const audioFile = event.target.file.files[0];
			const audioRef = storage.ref(audioFile.name);
			const upload = audioRef.put(audioFile);
			upload.on('state_changed', snapshot => {
				if (snapshot.bytesTransferred >= snapshot.totalBytes) {
					db.collection(getLetter(entry)).doc(entry).set({
						entry,
						gramm,
						images,
						audios: [...audios, audioFile.name]
					}).then(result => {
						console.log(result);
						handleClose(false)
						window.location.reload();
					})
						.catch(error => console.log(error));
				}
			})
		}
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
				<label htmlFor="audio">Definição para {entry}</label>
					<input name="file" value={state.audio} onChange={e => setState({ audio: e.target.value })} type="file" />
				</div>
				<button type="submit">Upload</button>
				<button type="reset" onClick={handleClose}>Cancelar</button>
			</form>
		</div>
	);
}

export default AudioForm;