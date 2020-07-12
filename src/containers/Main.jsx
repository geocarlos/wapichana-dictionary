import React, { useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppContext from '../context/app-context';
// import wordList from '../data/entries.json';
import firebase from '../firebase';
import { useEffect } from 'react';
const audioUrl = 'https://firebasestorage.googleapis.com/v0/b/wapichana-dictionary.appspot.com/o/';

const db = firebase.database();
const dataRef = db.ref();

const Main = () => {
	const [letter, setLetter] = useState('A');
	const [wordList, setWordList] = useState({});

	useEffect(() => {
		dataRef.once('value')
		.then(snapshot => {
			setWordList(snapshot.val()['wapichana_portuguese']);
		})
	}, [wordList])
	
	return (
		<main>
			<Header />
			<AppContext.Provider value={{ wordList, audioUrl }}>
				<Router>
					<LetterNav setLetter={setLetter} />
					<Switch>
						<Route exact path="/">
							<WordList letter={letter} />
						</Route>
						<Route path="/:wordId/:word">
							<Word />
						</Route>
					</Switch>
				</Router>
			</AppContext.Provider>
		</main>
	)
}

export default Main;