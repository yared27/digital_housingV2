import { BrowserRouter as Router, Routes,Route } from "react-router-dom"
import Home from "./pages/home"
import SignupPage from "./pages/signup"
const AppRoutes =() =>{

return(<>

    <Router>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path = "/signup" element ={<SignupPage/>}/>
    </Routes>
    </Router>
</>
)
}

export default AppRoutes