import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ContactVerma from './pages/ContactVerma';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './Components/Header';
import PrivateRoute from './Components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Footer from './Components/Footer';



export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<ContactVerma />} />
      <Route path='/listing/:listingId' element={<Listing />} />
      <Route path='/search' element={<Search />} />
      
      <Route element={<PrivateRoute />} >
      <Route path='/profile' element={<Profile />} />
      <Route path='/createListing' element={<CreateListing />} />
      <Route path='/updatelisting/:listingId' element={<UpdateListing />} />
      </Route>

      <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
    
    <Footer />
    </BrowserRouter>
  )
}
