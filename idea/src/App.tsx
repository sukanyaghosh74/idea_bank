import Home from './pages/Home'
import Landing from './pages/Landing'
import { useEffect, useState, type ReactElement } from 'react'

function App(): ReactElement {
  const [showApp, setShowApp] = useState(false)
  useEffect(() => {
    if (location.hash === '#app') setShowApp(true)
    const onHash = () => setShowApp(location.hash === '#app')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return showApp ? <Home /> : <Landing />
}

export default App


