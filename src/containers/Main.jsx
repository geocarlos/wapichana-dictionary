import React, { useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppContext from '../context/app-context';
import firebase from '../firebase';
import { useEffect } from 'react';
const audioUrl = 'https://firebasestorage.googleapis.com/v0/b/wapichana-dictionary.appspot.com/o/';

const db = firebase.firestore();

const Main = () => {
	const [letter, setLetter] = useState('NH');
	const [wordList, setWordList] = useState({});

	useEffect(() => {
		async function fetchData() {
			try {
				const snapshot = await db.collection(letter).get()
				const docs = await snapshot.docs.map(async doc => {
					const _doc = doc.data()
					try {
						const _snapshot = await db.collection(letter).doc(_doc.entry).collection('definitions').get();
						_doc.definitions = _snapshot.docs.map(d => d.data());
					return _doc;
					} catch (error) {
						console.log(error);
						return _doc;
					}
					});
				setWordList({...wordList, [letter]: await Promise.all(docs)});
			} catch (error) {
				console.log(error);
			}
		}
		if (!wordList[letter]) {
			fetchData();
		}	
	}, [wordList, letter])
	
	return (
		<main>
			<Header />
			<AppContext.Provider value={{ wordList, audioUrl, db }}>
				<Router>
					<LetterNav setLetter={setLetter} />
					<Switch>
						<Route exact path="/">
							<WordList letter={letter} />
						</Route>
						<Route path="/:entryKey">
							<Word />
						</Route>
					</Switch>
				</Router>
			</AppContext.Provider>
		</main>
	)
}

export default Main;