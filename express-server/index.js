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

(async () => {
	try {
		// await api.init({ username: "@.", password: "" });
		const result = await api.searchTracks("SLEEP PARALYSIS");
		// console.log({ result });
		// console.log(result.tracks.results[1]);
	} catch (e) {
		console.log(`api error ${e.message}`);
	}
})();

app.get('/song', (req, res) => {
	console.log('sh');
	res.end('sh');
});
