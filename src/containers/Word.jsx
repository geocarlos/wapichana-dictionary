import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AppContext from '../context/app-context';
import { useState } from 'react';
import { useEffect } from 'react';

const getLetter = key => {
	if ((key[0].toLowerCase() === 'c' || key[0].toLowerCase() === 'n') && key[1].toLowerCase() === 'h') {
		return key.substring(0,2).toUpperCase();
	}
	if (/\W/.test(key[0])) {
		return key[1].toUpperCase();
	}
	return key[0].toUpperCase();
}

const Word = () => {
	const history = useHistory();
	const { wordList, audioUrl, db } = useContext(AppContext);
	const [word, setWord] = useState(null);

	const { entryKey } = useParams();

	const letter = getLetter(entryKey);

	useEffect(() => {
		if(!word && wordList[letter]) {
			setWord(wordList[letter].filter(w => w.entry === entryKey)[0]);
			return;
		} else if (!word) {
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
					setWord({...word, definitions});
				})
				.catch(error => console.log(error))	
		}

		if (word && word.definitions && word.definitions.length > 0 && !word.definitions[0].examples) {
			for(let i = 0; i < word.definitions.length; i++) {
				db.collection(letter).doc(entryKey).collection('definitions').doc(i.toString()).collection('examples').get()
				.then(snapshot => {
					const definitions = word.definitions;
					definitions[i].examples = snapshot.docs.map(doc => doc.data());
					setWord({...word, definitions});
				})
				.catch(error => console.log(error))	
			}
		}

	}, [word]);

	if(!word) {
		return null;
	}

	console.log(word)

	return (
		<div style={{ margin: '10%' }}>
			<h1>{word.entry}</h1>
			{(word.audios || []).length > 0 && (
			<audio controls>
				<source src={`${audioUrl + word.audios[0]}?alt=media`}/>
			</audio>)}
			{(word.definitions || []).map((d, i)=> (
				<React.Fragment key={d.definition}>
					<p>{`${i + 1}. ${d.definition}`}</p>
					{(d.examples || []).map(e => (
						<React.Fragment key={e.example}>
							<p><b>{e.example}</b></p>
							<p>{e.exampleTranslation}</p>
						</React.Fragment>
					))}
					<br/>
				</React.Fragment>
			))}
			<button onClick={() => history.push('/')}>Voltar à lista</button>
		</div>
	)
}

export default Word;