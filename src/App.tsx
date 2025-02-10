import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Attendance from './pages/Attendance';
import Notes from './pages/Notes';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import About from './pages/About';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;