import React, { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './EntryEditor.css';
import { useParams, useHistory } from 'react-router-dom';
import appContext from '../context/app-context';
import DefinitionForm from './DefinitionForm';
import ExampleForm from './ExampleForm';
import { getLetter } from '../functions/functions';
import AudioForm from './AudioForm';
import GrammarForm from './GrammarForm';
import ImageForm from './ImageForm';

const EntryEditor = () => {
	const [entry, setEntry] = useState({
		entry: '',
		gramm: '',
		definitions: null,
		audios: null,
		images: null
	})

	const [formsOpen, setFormsOpen] = useState({
		gramm: false,
		audio: {
			open: false,
			index: 0
		},
		definition: {
			open: false,
			index: 0
		},
		example: {
			open: false,
			definition: 0,
			index: 0
		},
		image: {
			open: false,
			index: 0
		}
	})

	const [index, setIndex] = useState(0);

	const saveEntry = e => {
		e.preventDefault();
		console.log(entry);
	}

	const { audioUrl, db, storage } = useContext(appContext);
	const { entryKey } = useParams();
	const history = useHistory();

	const letter = getLetter(entryKey);

	useEffect(() => {
		if (!entry.entry) {
			db.collection(letter).doc(entryKey).get()
				.then(doc => {
					setEntry(doc.data());
				})
				.catch(error => console.log(error))
		}

		if (entry.entry && !entry.definitions) {
			db.collection(letter).doc(entryKey).collection('definitions').get()
				.then(snapshot => {
					const definitions = snapshot.docs.map(doc => doc.data());
					setEntry({ ...entry, definitions });
				})
				.catch(error => console.log(error))
		}

		if (entry && entry.definitions && entry.definitions.length > 0 && !entry.definitions[0].examples) {
			for (let i = 0; i < entry.definitions.length; i++) {
				db.collection(letter).doc(entryKey).collection('definitions').doc(i.toString()).collection('examples').get()
					.then(snapshot => {
						const definitions = entry.definitions;
						definitions[i].examples = snapshot.docs.map(doc => doc.data());
						setEntry({ ...entry, definitions });
					})
					.catch(error => console.log(error))
			}
		}

	}, [entry]);

	if (!entry) {
		return null;
	}

	if (!entry.images) {
		entry.images = [];
	}

	const handleOpenForms = (form, definition = null, index = null) => {
		console.log(entry[form + 's']);
		if (definition !== null) {
			setFormsOpen({ ...formsOpen, [form]: { open: true, definition, index: index || entry.definitions[definition][form + 's'].length } });
			return;
		}
		setFormsOpen({ ...formsOpen, [form]: { open: true, index: index || (entry[form + 's'] || []).length } })
	}

	const deleteMedia = (item, type) => {
		entry[type] = entry[type].filter(i => i !== item);
		db.collection(getLetter(entry.entry)).doc(entry.entry).set({
			entry: entry.entry,
			audios: entry.audios,
			images: entry.images,
			gramm: entry.gramm
		}).then(result => {
			console.log(result);
			storage.ref(item).delete()
			.then(_result => {
				console.log(_result);
				window.localStorage.removeItem('@wordlist');
				window.location.reload();
			})
			.catch(error => console.error(error.message));
		})
		.catch(error => console.log(error));
	}

	return (
		<div className="editor-container">
			<div style={{ margin: '10%' }}>
				<div><h1 style={{ display: 'inline' }}>{entry.entry}</h1>, gram. <em>{entry.gramm}</em></div>
				<button onClick={() => setFormsOpen({ ...formsOpen, gramm: { open: true } })}>Editar classe gramatical</button>
				<br />
				<div className="editor-audio">
					{(entry.audios || []).map((audio, i) => (
						<div key={audio + i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 .5rem 0 0', border: 'solid thin', borderRadius: '.5rem'}}>
							<audio controls>
								<source src={`${audioUrl + audio}?alt=media`} />
							</audio>
							<button onClick={() => deleteMedia(audio, 'audios')}>Excluir áudio</button>
						</div>))}
					<br />
					<button onClick={() => handleOpenForms('audio')}>Adicionar áudio</button>
				</div>
				<div className="editor-definitions">
					{(entry.definitions || []).map((d, i) => (
						<div className="definition" key={d.definition}>
							<p>{`${i + 1}. ${d.definition}`}</p>
							{(d.examples || []).map((e, j) => (
								<React.Fragment key={e.example}>
									<p><b>{e.example}</b></p>
									<p>{e.exampleTranslation}</p>
								</React.Fragment>
							))}
							<br />
							<button onClick={() => handleOpenForms('example', i)}>Adicionar exemplo</button>
							<br />
						</div>
					))}
					<button onClick={() => handleOpenForms('definition')}>Adicionar definição</button>
					<div className="back-button">
						<button onClick={() => history.push('/')}>Voltar à lista</button>
					</div>
				</div>
			</div>
			<div className="display-images">
				{(entry.images || []).map((img, i) => (
					<div key={img + i} className="image-item">
						<img src={`${audioUrl + img}?alt=media`} alt={img} />
						<button onClick={() => deleteMedia(img, 'images')}>Excluir image</button>
					</div>
				))}
				<button onClick={() => handleOpenForms('image')}>Adicionar imagem</button>
			</div>
			{formsOpen.audio.open && <AudioForm setFormsOpen={setFormsOpen} entry={entry.entry} gramm={entry.gramm} audios={entry.audios} images={entry.images} />}
			{formsOpen.definition.open && <DefinitionForm setFormsOpen={setFormsOpen} entry={entry.entry} index={formsOpen.definition.index.toString()} />}
			{formsOpen.example.open && <ExampleForm setFormsOpen={setFormsOpen} entry={entry.entry} index={formsOpen.example.index.toString()} definition={formsOpen.example.definition.toString()} />}
			{formsOpen.gramm.open && <GrammarForm setFormsOpen={setFormsOpen} entry={entry.entry} gramm={entry.gramm} audios={entry.audios} images={entry.images} />}
			{formsOpen.image.open && <ImageForm setFormsOpen={setFormsOpen} entry={entry.entry} gramm={entry.gramm} audios={entry.audios} images={entry.images} />}
		</div>
	)
}

export default EntryEditor;