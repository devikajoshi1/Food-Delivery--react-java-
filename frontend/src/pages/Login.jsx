import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import api, { getError } from "../api"

function Login(){
    const [form, setForm] = useState({email:'',password:''})
    const [error,setError] = useState('')
    const {login} = useAuth()
    const navigate = useNavigate()

    function handleChange(e){
        setForm({...form, [e.target.name]: e.target.value})
    }

    async function handleSubmit(e){
        e.preventDefault()
        setError('')
        try{
            const res = await api.post('/auth/login',form)
            login(res.data)
            navigate(res.data.role === 'ADMIN' ? '/admin' : '/')
        }catch(err){
            setError(getError(err))
        }
    }

    return(
        <div className="auth-page">
            <form className="auth-box" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button className="btn btn-full" type="submit">Login</button>
                <p className="muted">New here? <Link to="/register"> Create an account </Link> </p>
            </form>
        </div>
    )
}
export default Login;