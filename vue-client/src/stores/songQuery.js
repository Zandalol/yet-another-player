import { reactive } from 'vue'

export const songQuery = reactive({
	query: '',
	update(qeury) {
		this.query = qeury
	}
})
