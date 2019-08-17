import axios from 'axios'

const base_url = process.env.REACT_APP_BASE_URL || 'http://localhost:3001'
const api = axios.create({
	baseURL: base_url
})
export default api
