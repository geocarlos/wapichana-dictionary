import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/app-context';
import PlayStop from '../components/PlayStop';

const WordList = ({ letter = 'A'}) => {
	const { wordList, audioUrl } = useContext(AppContext);
	
	const [audio, setAudio] = useState();

	const play = url => {
		console.log(url)
		if (audio) {
			audio.pause();
		}
		setAudio(new Audio(url));
	}

	const stop = () => {
		if (audio) {
			audio.pause();
			setAudio(null);
		}
	}

	useEffect(() => {
		if (audio) {
			audio.onended = stop;
			audio.play();
		}
	}, [audio])

	if (!wordList[letter]) {
		return null;
	}

	return (
		<section className="wapi">
			<h2 id={letter}>{letter}</h2>
			<ul>
				{Object.keys(wordList[letter]).filter(w => wordList[w] !== null).map((d, i) => {
					return wordList[letter][d] && <li className="word-card" key={d + i}>
							<Link to={`/${i}/${d}`}>{d}</Link> - {(wordList[letter][d].definitions || []).map(d => d.definition).join('; ')}
							<div>
								{wordList[letter][d].audios && wordList[letter][d].audios.length > 0 && <span onClick={() => {
									audio && audio.src.includes(wordList[letter][d].audios[0]) ? stop() : play(`${audioUrl + wordList[letter][d].audios[0]}?alt=media`);
									}}>
									<PlayStop isPlaying={audio && audio.src.includes(wordList[letter][d].audios[0])} />
								</span>}
							</div>
						</li>
				})}
			</ul>
		</section>
	)
}

export default WordList;