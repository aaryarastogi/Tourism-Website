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

import { useTheme } from './context/ThemeContext';
import ResetPassword from './Pages/Login/ResetPassword';
import ForgotPassword from './Pages/Login/ForgotPassword';

function App() {
  const { isDark } = useTheme();
  
  return (
    <div className={`App min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
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
          <Route path="/reset-password" element={<ForgotPassword/>}></Route>
          <Route path='/user/reset/:id/:token' element={<ResetPassword/>}></Route>
          <Route path="/place/:id" element={<PlaceDetail/>} />
          <Route path='/*' element={<NotFound/>}></Route>
        </Routes>
        <ChatBot/>
    </div>
  );
}

export default App;