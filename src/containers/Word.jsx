import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import AppContext from '../context/app-context';

const Word = () => {
	const history = useHistory();
	const { wordList, audioUrl } = useContext(AppContext);

	const { wordId } = useParams();

	const keys = Object.keys(wordList);

	return (
		<div style={{ margin: '10%' }}>
			<h1>{wordList[keys[wordId]].entry}</h1>
			<audio controls>
				<source src={`${audioUrl + wordList[keys[wordId]].audios[0]}?alt=media`}/>
			</audio>
			{wordList[keys[wordId]].definitions.map((d, i)=> (
				<React.Fragment key={d.definition}>
					<p>{`${i + 1}. ${d.definition}`}</p>
					{d.examples.map(e => (
						<React.Fragment key={e.example}>
							<p><b>{e.example}</b></p>
							<p>{e.exampleTranslation}</p>
						</React.Fragment>
					))}
					<br/>
				</React.Fragment>
			))}
			<button onClick={() => history.push('/')}>Go Back</button>
		</div>
	)
}

export default Word;