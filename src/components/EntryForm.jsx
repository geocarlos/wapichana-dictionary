import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './EntryForm.css';

const EntryForm = ({ _entry = null }) => {
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
		console.log(event);
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
					<div>
						<p>{i + 1} - {d}</p>
						{d.examples.map(e => (
							<>
								<div>
									<p><b>{e.example}</b></p>
									<p>{e.exampleTranslation}</p>
								</div>
								<button>Adicionar Exemplo</button>
							</>
						))}
					</div>
				))}
				<button>Adicionar definição</button>
			</div>
			<div className="field">
				<label htmlFor="audios">Audios: </label>
				{entry.audios.map((a, i) => (
					<div>{'audio name'}</div>
				))}
				<button>Adicionar áudio</button>
			</div>
			<div className="field">
				<label htmlFor="images">Imagens: </label>
				{entry.images.map((a, i) => (
					<div>{'image name'}</div>
				))}
				<button>Adicionar imagem</button>
			</div>
			<button>Salvar</button>
			<button type="reset" onClick={() => console.log(false)}>Voltar à lista</button>
		</form>
		</div>
	)
}

export default EntryForm;