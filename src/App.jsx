import './App.css';
import { Routes, Route } from "react-router-dom"
import Home from './pages/home';
import Member from './pages/member';
import Paket from './pages/paket';
import User from './pages/user';
import Transaksi from './pages/transaksi';
import Login from './pages/login';


function App() {
  return (
    <Routes>
			<Route path='/' element={<Home/>} />
			 <Route path='/login' element={<Login/>} />
			 <Route path='/member' element={<Member/>} />
			 <Route path='/paket' element={<Paket/>} />
			 <Route path='/user' element={<User/>} />
			 <Route path='/transaksi' element={<Transaksi/>} />
	</Routes>
  );
}

export default App;
