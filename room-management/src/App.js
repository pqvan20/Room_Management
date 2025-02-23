import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Read from './components/Read'
import Write from './components/Write'
import Edit from './components/Edit'
import Update from './components/Update'


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={ <Edit /> } />
          <Route path="/writeProduct" element={ <Write /> } />
          <Route path="/editProduct" element={ <Edit /> } />
          <Route path="/updateProduct/:firebaseId" element={ <Update /> } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
