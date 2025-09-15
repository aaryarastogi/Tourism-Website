import './App.css';
import Navbar from './Pages/Navbar/Navbar';
import { Routes , Route } from 'react-router-dom';
import SignUp from './Pages/Login/SignUp';
import Main from './Pages/Main';
import Hotels from'./Pages/BookingPart/Hotels/Hotels';
import SignIn from './Pages/Login/SignIn';
import Flights from './Pages/BookingPart/Flights/Flights';
import Trains from './Pages/BookingPart/Trains/Trains';
import Forex from './Pages/BookingPart/Forex/Forex';
import Cabs from './Pages/BookingPart/Cabs/Cabs';
import MyTrips from './Pages/Trips/MyTrips'
import MyAccount from './Pages/Account/MyAccount';
import Registered from './Pages/Login/Registered';
import NotFound from './Pages/NotFound';
import PlaceDetail from './Pages/Explore/PlaceDetail';
import ChatBot from './Pages/Chatbot/Chatbot';

function App() {
  return (
    <div className="App bg-gradient-to-tr from-[#FA8BFF] via-[#2BD2FF] to-[#2BFF88]">
        <Navbar/>
        <Routes>
          <Route path='/' element={<Main/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>
          <Route path='/signin' element={<SignIn/>}></Route>
          <Route path='/hotels' element={<Hotels/>}></Route>
          <Route path='/flights' element={<Flights/>}></Route>
          <Route path='/trains' element={<Trains/>}></Route>
          <Route path='/cabs' element={<Cabs/>}></Route>
          <Route path='/forex' element={<Forex/>}></Route>
          <Route path='/mytrips' element={<MyTrips/>}></Route>
          <Route path='/myprofile' element={<MyAccount/>}></Route>
          <Route path='/registered' element={<Registered/>}></Route>
          <Route path="/place/:id" element={<PlaceDetail/>} />
          <Route path='/*' element={<NotFound/>}></Route>
        </Routes>
        <ChatBot/>
    </div>
  );
}

export default App;