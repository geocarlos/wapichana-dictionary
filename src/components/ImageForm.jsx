import React, { useState } from 'react';
import './NewEntryForm.css';
import { useContext } from 'react';
import appContext from '../context/app-context';
import { getLetter } from '../functions/functions';


const ImageForm = ({ setFormsOpen, entry, gramm, audios, images}) => {
	const [state, setState] = useState({
		image: []
	});

	console.log(images)

	const { db, storage } = useContext(appContext);

	const handleClose = () => {
		setFormsOpen(previous => ({...previous, image: false}));
	}

	const handleSubmit = event => {
		event.preventDefault();
		if (state.image.length !== 0) {
			console.log(event.target.file.files);
			const imageFile = event.target.file.files[0];
			const imageRef = storage.ref(imageFile.name);
			const upload = imageRef.put(imageFile);
			upload.on('state_changed', snapshot => {
				if (snapshot.bytesTransferred >= snapshot.totalBytes) {
					db.collection(getLetter(entry)).doc(entry).set({
						entry,
						gramm,
						images: [...images, imageFile.name],
						audios
					}).then(result => {
						console.log(result);
						handleClose(false);
						window.localStorage.removeItem('@wordlist');
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
				<label htmlFor="audio">Imagem para {entry}</label>
					<input name="file" value={state.image} onChange={e => setState({ image: e.target.value })} type="file" />
				</div>
				<button type="submit">Upload</button>
				<button type="reset" onClick={handleClose}>Cancelar</button>
			</form>
		</div>
	);
}

export default ImageForm;