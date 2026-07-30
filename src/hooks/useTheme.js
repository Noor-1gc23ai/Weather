import {useState, useEffect} from 'react'

export default function useTheme(){
  const [mode, setMode] = useState(localStorage.getItem('mode')||'light')
  useEffect(()=>{localStorage.setItem('mode',mode)},[mode])
  return {mode, setMode}
}
