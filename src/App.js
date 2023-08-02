import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './pages/Signin';
import Home from './pages/Home';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin/*" element={<Signin />} />
      </Routes>
    </Router>
    
  );
}

export default App;
