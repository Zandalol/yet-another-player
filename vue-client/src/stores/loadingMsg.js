import { reactive } from 'vue'

export const loadingMsg = reactive({
	msg: 'Ожидание⠀ввода...',
	loading() {
		this.msg = 'Загрузка...'
	},
	waiting() {
		this.msg = 'Ожидание⠀ввода...'
	}
})
