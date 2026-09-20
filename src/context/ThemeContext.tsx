
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme="light"|"dark";

interface ThemeContextType{
    theme:Theme;
    toggleTheme:()=>void;
}

const ThemeContext=createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}:{children:ReactNode}){
    const [theme,setTheme]=useState<Theme>(()=>{
        const savedTheme=localStorage.getItem("researchmate-theme");
        if(savedTheme==="dark" || savedTheme==="light"){
            return savedTheme;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";

    });

    useEffect(()=>{
        document.documentElement.classList.toggle("dark",theme==="dark");
        localStorage.setItem("researchmate-theme",theme);
    },[theme])

    function toggleTheme(){
        setTheme((current)=>(current==="light"?"dark":"light"));
    }
    return(
        <ThemeContext.Provider value={{theme,toggleTheme}}>
                {children}
        </ThemeContext.Provider>
    )
}


export function useTheme(){
    const context=useContext(ThemeContext);
    if(!context){
        throw new Error("useTheme must be used inside ThemeProvider");
    }
    return context;
}