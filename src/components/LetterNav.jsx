import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import appContext from '../context/app-context';

const LetterNav = ({ setLetter, setFormOpen, setLoginFormOpen, signOut }) => {
	const letters = ['A', 'B', 'D', 'G', 'I', 'K', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'W', 'X', 'Y', 'Z', 'NH', 'CH'];
	const { isLoggedIn } = useContext(appContext);
	return (
		<>
		<section className="search">
			<ul className="alfabeto">
				{letters.slice(0,letters.indexOf('S')).map(letter => (
					<li key={letter} onClick={() => setLetter(letter)}><Link to='/'>{letter}</Link></li>
				))}
			</ul>
			<ul className="alfabeto">
				{letters.slice(letters.indexOf('S')).map(letter => (
					<li key={letter} onClick={() => setLetter(letter)}><Link to='/'>{letter}</Link></li>
				))}
			</ul>
			{isLoggedIn && (
				<>
				<button onClick={signOut}>Sair</button>
				<button onClick={() => setFormOpen(true)}>Adicionar novo vocábulo</button>
				</>
			)}
			{!isLoggedIn && <button onClick={() => setLoginFormOpen(true)}>Login</button>}
		</section>
		</>
	);
}

export default LetterNav;