// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import getColors from "get-image-colors";

// const API_URL = "https://cms.samespace.com/items/songs";

// const Player = () => {
// 	const [songs, setSongs] = useState([]);
// 	const [currentSongIndex, setCurrentSongIndex] = useState(0);
// 	const [isPlaying, setIsPlaying] = useState(false);
// 	const [volume, setVolume] = useState(0.5);
// 	const [progress, setProgress] = useState(0);
// 	const [duration, setDuration] = useState(0);
// 	const [colorScheme, setColorScheme] = useState(["#000000", "#ffffff"]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState("");
// 	const audioRef = useRef(null);

// 	useEffect(() => {
// 		const fetchSongs = async () => {
// 			try {
// 				const response = await axios.get(API_URL);
// 				if (response.data.data) {
// 					setSongs(response.data.data);
// 					setLoading(false);
// 				} else {
// 					setError("No songs found");
// 					setLoading(false);
// 				}
// 			} catch (err) {
// 				setError("Failed to fetch songs");
// 				setLoading(false);
// 			}
// 		};

// 		fetchSongs();
// 	}, []);

// 	useEffect(() => {
// 		if (audioRef.current) {
// 			audioRef.current.volume = volume;
// 		}
// 	}, [volume]);

// 	useEffect(() => {
// 		if (audioRef.current) {
// 			const updateProgress = () => {
// 				setProgress(audioRef.current.currentTime);
// 			};

// 			audioRef.current.ontimeupdate = updateProgress;

// 			audioRef.current.onended = () => {
// 				setIsPlaying(false);
// 				setProgress(0);
// 			};
// 		}
// 	}, [isPlaying]);

// 	useEffect(() => {
// 		if (songs.length && audioRef.current) {
// 			const song = songs[currentSongIndex];
// 			audioRef.current.src = `https://cms.samespace.com/assets/${song.url}`;

// 			setDuration(0);
// 			setProgress(0);

// 			audioRef.current.onloadedmetadata = () => {
// 				setDuration(audioRef.current.duration);
// 			};
// 			audioRef.current.play();
// 			setIsPlaying(true);

// 			const imageUrl = `https://cms.samespace.com/assets/${song.cover}`;
// 			getColors(imageUrl).then((colors) => {
// 				const [dominantColor] = colors.map((color) => color.hex());
// 				setColorScheme([dominantColor, "#000000"]);
// 			});
// 		}
// 	}, [currentSongIndex, songs]);

// 	const handlePlayPause = () => {
// 		if (isPlaying) {
// 			audioRef.current.pause();
// 		} else {
// 			audioRef.current.play();
// 		}
// 		setIsPlaying(!isPlaying);
// 	};

// 	const handleVolumeChange = (e) => {
// 		setVolume(e.target.value);
// 	};

// 	const handleProgressChange = (e) => {
// 		const newTime = (e.target.value / 100) * duration;
// 		audioRef.current.currentTime = newTime;
// 		setProgress(newTime);
// 	};

// 	const handleNext = () => {
// 		setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
// 	};

// 	const handlePrevious = () => {
// 		setCurrentSongIndex((prevIndex) =>
// 			prevIndex === 0 ? songs.length - 1 : prevIndex - 1
// 		);
// 	};

// 	if (loading) return <p>Loading...</p>;
// 	if (error) return <p>{error}</p>;

// 	const currentSong = songs[currentSongIndex];

// 	return (
// 		<div
// 			className="flex flex-col items-center justify-center h-screen text-white"
// 			style={{
// 				backgroundImage: `linear-gradient(to right, ${colorScheme[0]}, ${colorScheme[1]})`,
// 				backgroundSize: "cover",
// 				backgroundPosition: "center",
// 			}}
// 		>
// 			<div className="text-center">
// 				{currentSong ? (
// 					<>
// 						<img
// 							src={`https://cms.samespace.com/assets/${currentSong.cover}`}
// 							alt={currentSong.title}
// 							className="w-48 h-48 rounded-full mb-4"
// 						/>
// 						<h2 className="text-2xl font-bold mb-2">{currentSong.title}</h2>
// 						<p className="text-lg">{currentSong.artist}</p>

// 						<div className="flex items-center my-4">
// 							<button
// 								className="bg-gray-700 p-2 rounded-full"
// 								onClick={handlePrevious}
// 							>
// 								&#9664;
// 							</button>
// 							<button
// 								className="bg-yellow-500 p-2 mx-4 rounded-full"
// 								onClick={handlePlayPause}
// 							>
// 								{isPlaying ? "Pause" : "Play"}
// 							</button>
// 							<button
// 								className="bg-gray-700 p-2 rounded-full"
// 								onClick={handleNext}
// 							>
// 								&#9654;
// 							</button>
// 						</div>

// 						<input
// 							type="range"
// 							min="0"
// 							max="100"
// 							value={(progress / duration) * 100 || 0}
// 							onChange={handleProgressChange}
// 							className="w-full mb-2"
// 						/>
// 						<div className="flex justify-between text-sm mb-2">
// 							<span>
// 								{Math.floor(progress / 60)}:{Math.floor(progress % 60)}
// 							</span>
// 							<span>
// 								{Math.floor(duration / 60)}:{Math.floor(duration % 60)}
// 							</span>
// 						</div>

// 						<input
// 							type="range"
// 							min="0"
// 							max="1"
// 							step="0.01"
// 							value={volume}
// 							onChange={handleVolumeChange}
// 							className="w-full"
// 						/>
// 					</>
// 				) : (
// 					<p>Select a song to play</p>
// 				)}
// 			</div>

// 			<audio ref={audioRef} />
// 		</div>
// 	);
// };

// export default Player;
