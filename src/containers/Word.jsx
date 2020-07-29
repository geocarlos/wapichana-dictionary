import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AppContext from '../context/app-context';
import { useState } from 'react';
import { useEffect } from 'react';
import { getLetter } from '../functions/functions';

const Word = () => {
	const history = useHistory();
	const { wordList, audioUrl, db, isLoggedIn } = useContext(AppContext);
	const [word, setWord] = useState({
		entry: '',
		gramm: '',
		definitions: null,
		audios: null,
		images: null
	});

	const { entryKey } = useParams();

	const letter = getLetter(entryKey);

	useEffect(() => {
		db.enableNetwork();
		if (!word.entry && wordList[letter]) {
			setWord(wordList[letter].filter(w => w.entry === entryKey)[0]);
			return;
		} else if (!word.entry) {
			db.collection(letter).doc(entryKey).get()
				.then(doc => {
					setWord(doc.data());
				})
				.catch(error => console.log(error))
		}

		if (word && !word.definitions) {
			db.collection(letter).doc(entryKey).collection('definitions').get()
				.then(snapshot => {
					const definitions = snapshot.docs.map(doc => doc.data());
					setWord({ ...word, definitions });
				})
				.catch(error => console.log(error))
		}

		if (word && word.definitions && word.definitions.length > 0 && !word.definitions[0].examples) {
			for (let i = 0; i < word.definitions.length; i++) {
				db.collection(letter).doc(entryKey).collection('definitions').doc(i.toString()).collection('examples').get()
					.then(snapshot => {
						const definitions = word.definitions;
						definitions[i].examples = snapshot.docs.map(doc => doc.data());
						setWord({ ...word, definitions });
					})
					.catch(error => console.log(error))
			}
		}

	}, [word]);

	if (!word) {
		return null;
	}

	const leavePage = () => {
		db.disableNetwork();
		history.push('/');
	}

	return (
		<div className="word-container">
			<div style={{ margin: '10%' }}>
				<div><h1 style={{display: 'inline'}}>{word.entry}</h1>, gram. <em>{word.gramm}</em></div>
				<br />
				{(word.audios || []).map((audio, i) => (
					<audio key={audio + i} controls>
						<source src={`${audioUrl + audio}?alt=media`} />
					</audio>))}
				{(word.definitions || []).map((d, i) => (
					<React.Fragment key={d.definition}>
						<p>{`${i + 1}. ${d.definition}`}</p>
						{(d.examples || []).map(e => (
							<React.Fragment key={e.example}>
								<p><b>{e.example}</b></p>
								<p>{e.exampleTranslation}</p>
							</React.Fragment>
						))}
						<br />
					</React.Fragment>
				))}
				<button onClick={leavePage}>Voltar à lista</button>
				{isLoggedIn && <button onClick={() => history.push(`/entry-editor/${entryKey}`)}>Editar</button>}
			</div>
			<div className="display-images">
				{(word.images || []).map(img => (
					<div className="image-item">
						<img src="" alt=""/>
					</div>
				))}
			</div>
		</div>
	)
}

export default Word;