<script setup>
defineProps({
	id: Number,
	title: String,
	artist: String,
	album: String,
	year: Number
})
</script>


<template>
	<div class="flex justify-between bg-pink-50 md:mx-10 my-2 md:my-5 px-5 py-5 md:px-10 md:text-xl shadow-md">
		<div>
			<div class="font-bold text-black">{{ title }}</div>
			<div class="text-gray-600">{{ artist }}</div>
		</div>
		<div class="text-right">
			<div class="font-bold text-black">{{ album }}</div>
			<div class="text-gray-600">{{ year }}</div>
		</div>
	</div>
</template>
