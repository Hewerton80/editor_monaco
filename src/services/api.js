import axios from 'axios'

const api = axios.create({
	baseURL: process.env.BASE_URL || 'http://localhost:3001'
	console.log('URL: '+ process.env.BASE_URL)
})
export default api
