import axios from 'axios'

const base_url = process.env.REACT_APP_BASE_URL || 'http://localhost:3001'
const api = axios.create({
	baseURL: base_url
})
api.interceptors.request.use(async config =>{
	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNmZmMmY3NWU1NjQxMTdjNDUwMjlhZSIsImlhdCI6MTU2NzYxOTE1NywiZXhwIjoxNTY3NzA1NTU3fQ.VEg4Psw_BR8prh340qE_0TWB6THxvUbH_hGQTqkQYRk"//localStorage.getItem('auth-token')
	if(token){
		config.headers.authorization = `Bearer ${token}`
	}
	return config
})
export default api
