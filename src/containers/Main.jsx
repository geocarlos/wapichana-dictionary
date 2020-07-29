import React, { useState } from 'react';
import WordList from './WordList';
import Word from './Word';
import LetterNav from '../components/LetterNav';
import Header from '../components/Header';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import AppContext from '../context/app-context';
import firebase from '../firebase';
import { useEffect } from 'react';
import NewEntryForm from '../components/NewEntryForm';
import EntryEditor from '../components/EntryEditor';
import LoginForm from '../components/LoginForm';
const audioUrl = 'https://firebasestorage.googleapis.com/v0/b/wapichana-dictionary.appspot.com/o/';

const db = firebase.firestore();
const storage = firebase.storage();
const _list = JSON.parse(window.localStorage.getItem('@wordlist') || {});
console.log(_list)

const Main = () => {
	const [letter, setLetter] = useState('A');
	const [wordList, setWordList] = useState(_list);
	const [isFormOpen, setFormOpen] = useState(false);
	const [isLoginFormOpen, setLoginFormOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleCloseNewEntryForm = () => {
		setFormOpen(false);
	}

	const handleCloseLoginForm = () => {
		setLoginFormOpen(false);
	}

	firebase.auth().onAuthStateChanged(user => {
		setIsLoggedIn(user !== null);
	});

	const signOut = () => {
		firebase.auth().signOut().then(() => {
			setIsLoggedIn(false);
			setLoginFormOpen(false);
		}).catch(error => console.log(error));
	}

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
				window.localStorage.setItem('@wordlist', JSON.stringify(wordList));
				db.disableNetwork();
			} catch (error) {
				console.log(error);
			}
		}
		if (!wordList[letter]) {
			db.enableNetwork();
			fetchData();
		}	
	}, [wordList, letter])
	
	return (
		<main>
			<Header />
			<AppContext.Provider value={{ wordList, audioUrl, db, storage, isLoggedIn }}>
				<Router>
					<LetterNav setLetter={setLetter}  setFormOpen={setFormOpen} setLoginFormOpen={setLoginFormOpen} signOut={signOut}/>
					<Switch>
						<Route exact path="/">
							<WordList letter={letter} />
						</Route>
						<Route exact path="/entry-editor/:entryKey">
							<EntryEditor />
						</Route>
						<Route path="/:entryKey">
							<Word />
						</Route>
					</Switch>
					{isFormOpen && isLoggedIn && <NewEntryForm handleClose={handleCloseNewEntryForm} />}
					{isLoginFormOpen && !isLoggedIn && <LoginForm handleClose={handleCloseLoginForm} />}
				</Router>
			</AppContext.Provider>
		</main>
	)
}

export default Main;