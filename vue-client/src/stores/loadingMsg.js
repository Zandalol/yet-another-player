import { reactive } from 'vue'

export const loadingMsg = reactive({
	msg: 'Ожидание⠀ввода...',
	status: false,
	loading() {
		this.msg = 'Загрузка...'
	},
	waiting() {
		this.msg = 'Ожидание⠀ввода...'
	},
	true() {
		this.status = true
	},
	false() {
		this.status = false
	}

})
