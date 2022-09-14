<script setup>
import { onMounted } from "vue";
import { useQuery, useIsFetching } from "vue-query";
import { songQuery } from '../stores/songQuery.js';
import Song from '@/components/Song.vue';

const waitingMsg = 'Ожидание⠀ввода...';
const loadingMsg = 'Загрузка...';

const isFetching = useIsFetching();

const localhostURL = 'http://localhost:' + import.meta.env.VITE_PORT;
const herokuURL = 'https://yet-another-player.herokuapp.com';
const currentURL = window.location.href.includes('localhost') ? localhostURL : herokuURL;
// const rootUrl = import.meta.env.MODE === 'production' ? currentURL : '';
async function fetchSong(songQuery) {
	if (songQuery.query === '') {
		console.log('songQuery.query is empty');
		return
	};
	console.log('fetching %s', currentURL + '/song/' + songQuery.query);
	const response = await fetch(currentURL + '/song/' + songQuery.query, {
		mode: 'cors',
		method: 'GET',
		headers: { Accept: 'application/json' }
	});
	if (!response.ok) {
		throw new Error('Network response was not ok')
	};
	console.log('success for %s song', songQuery.query);
	return await response.json();
}

const result = useQuery(['songQuery', songQuery], async () => fetchSong(songQuery), { refetchOnWindowFocus: false });

function cssVars(i) {
	return {
		'--i': i,
	}
};

const cyrillicPattern = /^\p{Script=Cyrillic}+$/u;
const btnHandler = async e => {
	e.preventDefault();
	const query = document.getElementById("song").value;
	if (cyrillicPattern.test(query)) {
		document.getElementById("warning").style.display = 'block';
		setTimeout(() => {
			document.getElementById("warning").style.display = 'none';
		}, 3000);
		return
	}
	songQuery.update(query)
};

const placeholders = [
	'Smells Like Teen Spirit', 'The Show Must Go On', 'Bohemian Rhapsody', 'Shape of You', 'Where Is My Mind',
	'Get Lucky'
];

onMounted(() => {
	const random = Math.floor(Math.random() * placeholders.length);
	document.getElementById('song').placeholder = placeholders[random]
})
</script>


<template>
	<div class="pattern flex justify-center mb-10">
		<form class="bg-white min-w-full md:min-w-fit text-center">
			<label for="song" class="block font-extralight text-2xl sm:px-10 md:text-4xl md:px-20 my-6 md:my-10">
				Начните вводить
				<span class="relative">
					<span class="block absolute -inset-1 -skew-y-3 bg-pink-500" aria-hidden="true"></span>
					<span class="relative text-white">название</span>
				</span>
				песни 🦄
			</label>

			<div class="flex w-full">
				<input id="song" name="song" type="text" autocomplete="off"	autofocus class="w-5/6 py-2 px-2 text-2xl
					md:py-3 md:px-3 md:text-4xl font-extralight rounded-xl border-4 border-x-rose-400 border-y-white
					hover:border-y-rose-200 focus:border-y-rose-200 text-center italic placeholder:text-rose-200
					focus:outline-none md:mr-3 caret-rose-900" spellcheck="false"
				>
				<button @click="btnHandler($event)" class="w-1/6 rounded-xl text-2xl md:text-4xl font-extralight
					bg-cyan-300 text-white border-4 border-cyan-300 hover:border-cyan-100"
				>
					Поиск
				</button>
			</div>
			<p id="warning" class="text-red-500 hidden fade-in-text">
				⚠️ Используйте только буквы латинского алфавита
			</p>
		</form>
	</div>

	<div v-if="isFetching" class="waviy text-center mt-6 md:mt-10">
		<span v-for="(item, index) in loadingMsg" :style="cssVars(index)" class="font-extralight text-2xl md:text-4xl">
			{{item}}
		</span>
	</div>

	<div v-else-if="result.data.isError">
		Error: {{ error.message }}
	</div>

	<div v-else-if="result.data.value">
		<div v-if="result.data.value.error">
			<p class="text-center">Что-то пошло не так :(</p>
			<p class="text-center">Попробуйте другой поисковой запрос</p>
		</div>

		<div v-else-if="result.data.value.songs" class="">
			<div class="flex justify-between md:mx-10 my-2 md:my-5 px-5 md:px-10 md:text-xl">
				<div class="font-bold text-rose-500 hover:underline">Название / исполнитель</div>
				<div class="font-bold text-rose-500 hover:underline">Альбом / год</div>
			</div>
			<Song v-bind='result.data.value.songs[0]' />
			<Song v-bind='result.data.value.songs[1]' />
			<Song v-bind='result.data.value.songs[2]' />
			<Song v-bind='result.data.value.songs[3]' />
			<Song v-bind='result.data.value.songs[4]' />
		</div>
	</div>

	<div v-else class="waviy text-center mt-6 md:mt-10">
		<span v-for="(item, index) in waitingMsg" :style="cssVars(index)" class="font-extralight text-3xl md:text-4xl">
			{{item}}
		</span>
	</div>
</template>


<style scoped>
.waviy span {
	position: relative;
	display: inline-block;
	animation: waviy 1s infinite;
	animation-delay: calc(.1s * var(--i));
}
@keyframes waviy {

	0%,
	40%,
	100% {
		transform: translateY(0)
	}

	20% {
		transform: translateY(-5px)
	}
}

.pattern {
	background:
		radial-gradient(black 3px, transparent 4px),
		radial-gradient(black 3px, transparent 4px),
		linear-gradient(#fff 4px, transparent 0),
		linear-gradient(45deg, transparent 74px, transparent 75px, #a4a4a4 75px, #a4a4a4 76px, transparent 77px, transparent 109px),
		linear-gradient(-45deg, transparent 75px, transparent 76px, #a4a4a4 76px, #a4a4a4 77px, transparent 78px, transparent 109px),
		#fff;
	background-size: 109px 109px, 109px 109px, 100% 6px, 109px 109px, 109px 109px;
	background-position: 54px 55px, 0px 0px, 0px 0px, 0px 0px, 0px 0px;
}

.fade-in-text {
	animation: fadeIn 1s;
}
@keyframes fadeIn {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}
</style>
