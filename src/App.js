import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import PlaylistPage from './pages/PlaylistPage';
import PlaylistDetails from './components/PlaylistDetails';

const App = () => (
  <Router>
    {/* <HomePage /> */}
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/playlists' element={<PlaylistPage/>}/>
      <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
    </Routes>
  </Router>
);

export default App;
