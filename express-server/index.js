const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { YMApi } = require('ym-api');

dotenv.config();

const api = new YMApi();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'vue-client', 'dist')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'vue-client', 'dist', 'index.html'));
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// (async () => {
//   try {
//     // await api.init({ username: "@.", password: "" });
//     const result = await api.searchArtists("gorillaz");
//     console.log({ result });
//   } catch (e) {
//     console.log(`api error ${e.message}`);
//   }
// })();

app.get('/song/:qeury', async (req, res) => {
	console.log('Searching for %s song', req.params.qeury);
	var songs = {songs: [], error: false};
	try {
		const result = await api.searchTracks(req.params.qeury);
		const tracks = result.tracks.results;
		const len = Object.keys(tracks).length
		for (let index = 0; index < Math.min(5, len); index++) {
			const element = tracks[index];
			songs.songs.push({
				id: element.id,
				title: element.title,
				artist: element.artists[0].name,
				album: element.albums[0].title,
				year: element.albums[0].year
			})
		}
		res.json(songs);
	} catch (error) {
		console.log(`ERROR: ${error.message}`);
		songs.error = true;
		res.json(songs)
	}
});
