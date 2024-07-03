import {BrowserRouter as Router}  from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import  NavBar  from './components/NavBar/NavBar'
import  AppRoutes  from './routes/AppRoutes'




function App() {
  return (
    <>
    <Router>
      <NavBar/>
      <AppRoutes/>
      <ToastContainer position="bottom-right" autoClose={3000}/>
    </Router>
    
    </>
  )
}

export default App