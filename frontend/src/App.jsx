
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Feed from './pages/feed';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
