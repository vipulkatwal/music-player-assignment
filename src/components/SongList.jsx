// import PropTypes from "prop-types";

// const SongList = ({ songs, setCurrentSong }) => {
// 	return (
// 		<div className="p-4">
// 			{songs.map((song) => (
// 				<div
// 					key={song.id}
// 					className="mb-4 p-2 bg-gray-700 text-white rounded cursor-pointer transition transform hover:scale-105"
// 					onClick={() => setCurrentSong(song)}
// 				>
// 					<img
// 						src={`https://cms.samespace.com/assets/${song.cover}`}
// 						alt={song.title}
// 						className="w-16 h-16 inline-block mr-4"
// 					/>
// 					<div className="inline-block align-middle">
// 						<h2 className="text-lg font-bold">{song.title}</h2>
// 						<p>{song.artist}</p>
// 					</div>
// 				</div>
// 			))}
// 		</div>
// 	);
// };

// SongList.propTypes = {
// 	songs: PropTypes.arrayOf(
// 		PropTypes.shape({
// 			id: PropTypes.number.isRequired,
// 			title: PropTypes.string.isRequired,
// 			artist: PropTypes.string.isRequired,
// 			cover: PropTypes.string.isRequired,
// 		})
// 	).isRequired,
// 	setCurrentSong: PropTypes.func.isRequired,
// };

// export default SongList;
