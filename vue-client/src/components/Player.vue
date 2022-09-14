<script setup>
import { useQuery, useIsFetching } from "vue-query";
import { loadingMsg } from './../stores/loadingMsg.js';
import { songQuery } from '../stores/songQuery.js';

const isFetching = useIsFetching();

const localhostURL = 'http://localhost:' + import.meta.env.VITE_PORT;
const herokuURL = 'https://yet-another-player.herokuapp.com';
const currentURL = window.location.href.includes('localhost') ? localhostURL : herokuURL;
// const rootUrl = import.meta.env.MODE === 'production' ? currentURL : '';
async function fetchSong(songQuery) {
	if (songQuery.query === '') {
		// console.log('songQuery.query is empty');
		return
	};
	const response = await fetch(currentURL + '/song/' + songQuery.query, {
		mode: 'cors',
		method: 'GET',
		headers: { Accept: 'application/json' }
	});
	if (!response.ok) {
		throw new Error('Network response was not ok')
	};
	return await response.json();
}

const result = useQuery(['songQuery', songQuery], async () => fetchSong(songQuery), { refetchOnWindowFocus: false });

function cssVars(i) {
	return {
		'--i': i,
	}
};

const keyupHandler = async e => {
	if (document.getElementById("song").value) {
		loadingMsg.loading();
		loadingMsg.true();
	} else {
		loadingMsg.waiting();
		loadingMsg.false()
	}
};

const btnHandler = async e => {
	e.preventDefault()
	songQuery.update(document.getElementById("song").value)
};
</script>


<template>
	<div class="pattern flex justify-center">
		<form class="bg-white min-w-full md:min-w-fit text-center">
			<label for="song" class="block font-extralight text-3xl sm:px-10 md:text-4xl md:px-20 my-6 md:my-10">
				Начните вводить
				<span class="relative">
					<span class="block absolute -inset-1 -skew-y-3 bg-pink-500" aria-hidden="true"></span>
					<span class="relative text-white">название</span>
				</span>
				песни 🦄
			</label>

			<div class="flex w-full">
				<input id="song" name="song" type="text" autocomplete="off" @keyup="keyupHandler($event)"
					placeholder="Smells Like Teen Spirit" autofocus class="w-5/6 py-2 px-2 text-3xl md:py-3 md:px-3
					md:text-4xl font-extralight rounded-xl border-4 border-x-rose-400 border-y-white
					hover:border-y-rose-200 focus:border-y-rose-200	text-center italic placeholder:text-rose-200
					focus:outline-none md:mr-3"
				>
				<button @click="btnHandler($event)" class="w-1/6 rounded-xl text-3xl md:text-4xl font-extralight
					bg-cyan-300 text-white border-4 border-cyan-300 hover:border-cyan-100"
				>
					Поиск
				</button>
			</div>
		</form>
	</div>

	<div v-if="!loadingMsg.status || isFetching" class="waviy text-center mt-6 md:mt-10">
		<span v-for="(item, index) in loadingMsg.msg" :style="cssVars(index)" class="font-extralight text-3xl md:text-4xl">
			{{item}}
		</span>
	</div>

	<div v-else-if="result.data.isError">
		Error: {{ error.message }}
	</div>

	<div v-else-if="result.data.value">
		<span>123</span>
		{{ result.data }}
	</div>

	<div v-else>
		Что-то пошло не так
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
</style>
