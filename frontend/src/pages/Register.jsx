import { useState } from "react";
import  { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api, { getError } from "../api";

function Register(){
    const [form, setForm] = useState({name:'', email:'', password:''})
    const [error, setError] = useState('')
    const{login} = useAuth()
    const navigate = useNavigate()

    function handleChange(e) {
        setForm({...form, [e.target.name]: e.target.value})
    }

    async function handleSubmit(e){
        e.preventDefault()
        setError('')
        try{
            const res = await api.post('/auth/register',form)
            login(res.data)
            navigate('/')
        }catch(err){
            setError(getError(err))
        }
    }

    return(
        <div className="auth-page">
            <form className="auth-box" onSubmit={handleSubmit}>
                <h2>Sign up</h2>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
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
                    placeholder="Password (min 6 character)"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button className="btn btn-full" type="submit">Create account </button>
                <p>Already have an account ? <Link to="/login">Login</Link></p>
            </form>
        </div>
    )

}
export default Register;