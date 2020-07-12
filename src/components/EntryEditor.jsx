import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './EntryEditor.css';

const EntryEditor = ({ _entry = null, setFormOpen }) => {
	const [entry, setEntry] = useState({
		entry: '',
		gramm: '',
		definitions: [],
		audios: [],
		images: []
	})

	useEffect(() => {
		if(_entry) {
			setEntry(_entry);
		}
	}, [_entry]);

	const saveEntry = e => {
		e.preventDefault();
		console.log(entry);
	}

	const handleClick = event => {
		if (event.target.className === 'entry-div') {
			setFormOpen(false);
		}
	}

	return (
		<div onClick={handleClick} className="entry-div">
		<form className="entry-form" onSubmit={saveEntry}>
			<div className="field">
				<label htmlFor="entry">Palavra em Wapichana: </label>
				<input 
					type="text" 
					value={entry.entry} 
					onChange={e => setEntry({...entry, entry: e.target.value})} />
			</div>
			<div className="field">
				<label htmlFor="gramm">Classe gramatical: </label>
				<input 
					type="text" 
					value={entry.gramm} 
					onChange={e => setEntry({...entry, gramm: e.target.value})} />
			</div>
			<div className="field">
				<label htmlFor="definitions">Definições: </label>
				{entry.definitions.map((d, i) => (
					<input
						key={'definition' + i} 
						type="text"
						value={d} 
						onChange={e => {
							const definitions = entry.definitions;
							definitions[i] = e.target.value;
							setEntry({	
								...entry, 
								definitions
							})}
							} />
				))}
			</div>
			<div className="field">
				<label htmlFor="audios">Audios: </label>
				{entry.audios.map((a, i) => (
					<input
						key={'audio' + i} 
						type="text"
						value={a} 
						onChange={e => {
							const audios = entry.audios;
							audios[i] = e.target.value;
							setEntry({	
								...entry, 
								audios
							})}
							} />
				))}
			</div>
			<div className="field">
				<label htmlFor="images">Imagens: </label>
				{entry.images.map((a, i) => (
					<input
						key={'image' + i} 
						type="text"
						value={a} 
						onChange={e => {
							const images = entry.images;
							images[i] = e.target.value;
							setEntry({	
								...entry, 
								images
							})}
							} />
				))}
			</div>
			<button>Salvar</button>
			<button type="reset" onClick={() => setFormOpen(false)}>Fechar</button>
		</form>
		</div>
	)
}

export default EntryEditor;