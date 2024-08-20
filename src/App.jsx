import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import * as Vibrant from "node-vibrant";
import prevIcon from "./assets/prev.png";
import pauseIcon from "./assets/pause.png";
import playIcon from "./assets/play.png";
import nextIcon from "./assets/next.png";
import userPlaceholder from "./assets/goofy-bald-dog.gif";
import spotifyLogo from "./assets/spotify_logo.png";
import shuffleIcon from "./assets/shuffle.png";
import volumeIcon from "./assets/volume.png";
import searchIcon from "./assets/search.png";

function App() {
	const [songs, setSongs] = useState([]);
	const [currentSongIndex, setCurrentSongIndex] = useState(0);
	const [sound, setSound] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [colorScheme, setColorScheme] = useState({
		primary: "#000000",
		secondary: "#ffffff",
	});
	const [view, setView] = useState("forYou");
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredSongs, setFilteredSongs] = useState([]);
	const [isShuffleOn, setIsShuffleOn] = useState(false);
	const seekBarRef = useRef(null);
	let animationRef = useRef();

	// Fetch songs on component mount
	useEffect(() => {
		fetchSongs();
	}, []);

	// Load song and extract colors when currentSongIndex or songs change
	useEffect(() => {
		if (songs.length > 0) {
			loadSong(currentSongIndex, false);
			const currentSong = songs[currentSongIndex];
			const imageUrl = `https://cms.samespace.com/assets/${currentSong.cover}`;
			extractColors(imageUrl);
		}
	}, [currentSongIndex, songs]);

	// Update current time when song is playing
	useEffect(() => {
		if (isPlaying) {
			animationRef.current = requestAnimationFrame(updateCurrentTime);
		} else {
			cancelAnimationFrame(animationRef.current);
		}
	}, [isPlaying]);

	// Fetch songs from API and get their durations
	const fetchSongs = async () => {
		const response = await fetch("https://cms.samespace.com/items/songs");
		const data = await response.json();
		const songsWithDuration = await Promise.all(
			data.data.map(async (song) => {
				const audio = new Audio(song.url);
				return new Promise((resolve) => {
					audio.onloadedmetadata = () => {
						resolve({
							...song,
							duration: audio.duration,
						});
					};
				});
			})
		);
		setSongs(songsWithDuration);
		setFilteredSongs(songsWithDuration);
	};

	// Extract dominant colors from song cover image
	const extractColors = async (imageUrl) => {
		try {
			const palette = await Vibrant.from(imageUrl).getPalette();
			setColorScheme({
				primary: palette.DarkVibrant.hex,
				secondary: palette.DarkVibrant.hex,
			});
		} catch (error) {
			console.error("Error extracting colors:", error);
		}
	};

	// Load song by index and set up Howl instance
	const loadSong = (index, play = true) => {
		const selectedSong = songs[index];
		if (selectedSong && sound) {
			sound.stop();
			setCurrentTime(0);
		}

		const newSound = new Howl({
			src: [selectedSong.url],
			volume: 0.5,
			onend: handleNext,
			onplay: () => {
				setIsPlaying(true);
			},
			onpause: () => {
				setIsPlaying(false);
			},
			onseek: () => {
				animationRef.current = requestAnimationFrame(updateCurrentTime);
			},
			onload: () => {
				setDuration(newSound.duration());
			},
		});

		setSound(newSound);

		if (play) {
			newSound.play();
		}
	};

	// Update current time of the song
	const updateCurrentTime = () => {
		if (sound && isPlaying) {
			setCurrentTime(sound.seek());
			animationRef.current = requestAnimationFrame(updateCurrentTime);
		}
	};

	// Handle seek bar change
	const handleSeek = (e) => {
		const seekTime = (e.target.value / 100) * duration;
		sound.seek(seekTime);
		setCurrentTime(seekTime);
	};

	// Pause sound when user interacts with seek bar
	const handleSeekMouseDown = () => {
		sound.pause();
	};

	// Resume sound playback when user releases seek bar
	const handleSeekMouseUp = () => {
		sound.play();
		setIsPlaying(true);
	};

	// Format time in minutes and seconds
	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};

	// Toggle play/pause state of the song
	const togglePlayPause = () => {
		if (isPlaying) {
			sound.pause();
		} else {
			sound.play();
		}
		setIsPlaying(!isPlaying);
	};

	// Handle the next song in the playlist
	const handleNext = () => {
		let nextIndex;
		if (isShuffleOn) {
			nextIndex = Math.floor(Math.random() * songs.length);
		} else {
			nextIndex = (currentSongIndex + 1) % songs.length;
		}
		setCurrentSongIndex(nextIndex);
	};

	// Handle the previous song in the playlist
	const handlePrevious = () => {
		const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
		setCurrentSongIndex(prevIndex);
	};

	// Handle song click to play or restart song
	const handleSongClick = (index) => {
		if (index === currentSongIndex) {
			if (isPlaying) {
				sound.stop();
				sound.play();
				setCurrentTime(0);
			}
		} else {
			setCurrentSongIndex(index);
			loadSong(index, true);
		}
	};

	// Filter songs based on search term
	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
		if (e.target.value) {
			const filtered = songs.filter(
				(song) =>
					song.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
					song.artist.toLowerCase().includes(e.target.value.toLowerCase())
			);
			setFilteredSongs(filtered);
		} else {
			setFilteredSongs(songs);
		}
	};

	// Change view mode and sort songs if needed
	const handleViewChange = (newView) => {
		setView(newView);
		if (newView === "topTracks") {
			const sortedSongs = [...songs].sort((a, b) => b.plays - a.plays);
			setFilteredSongs(sortedSongs);
		} else {
			setFilteredSongs(songs);
		}
	};

	// Toggle shuffle mode
	const toggleShuffle = () => {
		setIsShuffleOn(!isShuffleOn);
	};

	return (
		<div
			className="flex flex-col md:flex-row h-screen text-white"
			style={{
				background: `linear-gradient(to bottom left, ${colorScheme.primary}, ${colorScheme.secondary})`,
			}}
		>
			{/* Sidebar */}
			<div className="w-full md:w-72 relative flex flex-col h-full bg-black bg-opacity-50">
				<div className="p-6">
					<div className=" items-start justify-center">
						<img
							src={spotifyLogo}
							alt="Spotify"
							className="w-full max-w-[140px] h-auto"
						/>
					</div>
					<div className="absolute bottom-0 left-0 w-full p-4">
						<div className="flex items-center">
							<img
								src={userPlaceholder}
								alt="User"
								className="w-10 h-10 rounded-full mr-3"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Song List */}
			<div className="w-full md:w-96 flex flex-col bg-black bg-opacity-50">
				<div className="text-left mt-10 mb-6 font-work-sans text-xl">
					<span
						className={`mr-10 cursor-pointer ${
							view === "forYou" ? "text-white" : "text-gray-400"
						}`}
						onClick={() => handleViewChange("forYou")}
					>
						For You
					</span>
					<span
						className={`cursor-pointer ${
							view === "topTracks" ? "text-white" : "text-gray-400"
						}`}
						onClick={() => handleViewChange("topTracks")}
					>
						Top Tracks
					</span>
				</div>

				{/* Search Bar with Icon */}
				<div className="flex items-center mb-4 relative">
					<input
						type="text"
						placeholder="Search Song, Artist"
						className="rounded-md px-4 py-2 w-full focus:outline-none text-lg flex-1"
						value={searchTerm}
						onChange={handleSearch}
						style={{
							background: `linear-gradient(to bottom right, ${colorScheme.primary}, ${colorScheme.secondary})`,
						}}
					/>
					<img
						src={searchIcon}
						alt="Search"
						className="absolute right-4 w-6 h-6"
						style={{ filter: "brightness(0.6)" }}
					/>
				</div>

				{filteredSongs.map((song, index) => (
					<div
						key={song.id}
						className={`flex items-center p-2 rounded-lg cursor-pointer ${
							index === currentSongIndex ? "bg-white bg-opacity-10" : ""
						}`}
						onClick={() => handleSongClick(index)}
					>
						<img
							src={`https://cms.samespace.com/assets/${song.cover}`}
							alt={song.name}
							className="w-12 h-12 rounded-full mr-3"
						/>
						<div className="flex-1">
							<p className="font-work-sans text-lg">{song.name}</p>
							<p className="text-base text-gray-400">{song.artist}</p>
						</div>
						<span className="text-base text-gray-400">
							{formatTime(song.duration)}
						</span>
					</div>
				))}
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col bg-black bg-opacity-50">
				{/* Now Playing */}
				<div className="flex-1 flex items-center justify-center p-8">
					<div className="text-center">
						<div className="text-left">
							<h2 className="text-3xl font-work-sans mb-2">
								{songs[currentSongIndex]?.name}
							</h2>
							<p className="text-base text-gray-300 mb-3">
								{songs[currentSongIndex]?.artist}
							</p>
						</div>
						<img
							src={`https://cms.samespace.com/assets/${songs[currentSongIndex]?.cover}`}
							alt={songs[currentSongIndex]?.name}
							className="w-80 h-80 rounded-lg shadow-2xl mb-2 mx-auto"
						/>

						{/* Seek Bar */}
						<div className="w-full mb-4">
							<div className="relative">
								<input
									ref={seekBarRef}
									type="range"
									min="0"
									max="100"
									value={(currentTime / duration) * 100 || 0}
									onChange={handleSeek}
									onMouseDown={handleSeekMouseDown}
									onMouseUp={handleSeekMouseUp}
									className="w-full h-2 appearance-none bg-gray-600 rounded-lg cursor-pointer"
									style={{
										backgroundImage: `linear-gradient(to right, #fff 0%, #fff ${
											(currentTime / duration) * 100
										}%, #444 ${(currentTime / duration) * 100}%, #444 100%)`,
									}}
								/>
							</div>
							<div className="flex justify-between text-sm mt-1">
								<span>{formatTime(currentTime)}</span>
								<span>{formatTime(duration)}</span>
							</div>
						</div>

						{/* Controls */}
						<div className="flex items-center justify-center space-x-8">
							<button>
								<img
									src={shuffleIcon}
									alt="Shuffle"
									className={`w-5 h-5 ml-4 cursor-pointer ${
										isShuffleOn ? "opacity-100" : "opacity-50"
									}`}
									onClick={toggleShuffle}
								/>
							</button>
							<button onClick={handlePrevious}>
								<img src={prevIcon} alt="Previous" className="w-6 h-6" />
							</button>
							<button
								onClick={togglePlayPause}
								className="bg-black/40 rounded-full p-3"
							>
								<img
									src={isPlaying ? pauseIcon : playIcon}
									alt={isPlaying ? "Pause" : "Play"}
									className="w-6 h-6"
								/>
							</button>
							<button onClick={handleNext}>
								<img src={nextIcon} alt="Next" className="w-6 h-6" />
							</button>
							<button>
								<img src={volumeIcon} alt="Volume" className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
