import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

function loadUser() {
    //read the saved user
    try{
        const saved = JSON.parse(localStorage.getItem('user'))
        if(saved && saved.token){
            return saved
        }
    }catch(e){
        //
    }
    localStorage.removeItem('user')
    return null;
}

export function AuthProvider({children}){
    //{ token, name, email, role }
    const [user,setUser] = useState(loadUser)

    function login(data){
        localStorage.setItem('user',JSON.stringify(data))
        setUser(data)
    }
    function logout(){
        localStorage.removeItem("user")
        setUser(null)
    }
    return(
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}