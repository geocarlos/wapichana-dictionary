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
				{wordList[letter].filter(w => wordList[w] !== null).map((entry, i) => {
					return entry && <li className="word-card" key={entry.entry + i}>
							<Link to={`/${entry.entry}`}>{entry.entry}</Link> - {(entry.definitions || []).map(d => d.definition).join('; ')}
							<div>
								{entry.audios && entry.audios.length > 0 && <span onClick={() => {
									audio && audio.src.includes(entry.audios[0]) ? stop() : play(`${audioUrl + entry.audios[0]}?alt=media`);
									}}>
									<PlayStop isPlaying={audio && audio.src.includes(entry.audios[0])} />
								</span>}
							</div>
						</li>
				})}
			</ul>
		</section>
	)
}

export default WordList;