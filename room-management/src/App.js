import './index.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import WriteProduct from './components/WriteProduct'
import ManageProduct from './components/ManageProduct'
import EditProduct from './components/EditProduct'
import ManageBill from './components/ManageBill'
import WriteBill from './components/WriteBill'
import EditBill from './components/EditBill'
import WriteProductBill from './components/WriteProductBill'
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={ <ManageProduct /> } />
          <Route path="/writeProduct" element={ <WriteProduct /> } />
          <Route path="/editProduct/:firebaseId" element={ <EditProduct /> } />
          <Route path="/manageBill" element={ <ManageBill /> } />
          <Route path="/writeBill" element={ <WriteBill /> } />
          <Route path="/editBill/:firebaseId" element={ <EditBill /> } />
          <Route path="/writeProductBill/:firebaseId" element={ <WriteProductBill /> } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
