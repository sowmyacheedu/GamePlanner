import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home/Home';
import Login from './pages/login/login';
import Register from './pages/Register/Register';
import Forgot from './pages/Forgotpassword/Forgotpassword';
import Resetpassword from './pages/Resetpassword/Resetpassword';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import UserProfile from './pages/UserProfile/Userprofile';
import UserProfileEdit from './pages/UserProfile/Userprofileedit';
import Search from './pages/search/Search';
import EmployeeDashboard from './pages/EmployeeDB/EmployeeDB';
import DisplayFranchises from './pages/search/displayFranchises';
import WhyJoinUs from './pages/static/whyJoinUs';
import AboutUs from './pages/static/aboutUs';
import Bookings from './pages/Booking/Bookings';
import { AuthProvider, useAuth } from './Context/AuthContext';
import ChatsPage from './ChatsPage/index'
import Slots1 from './pages/Slotsavailability/Slotbooking';
import { useState } from 'react';
import { useEffect } from 'react';
import { gapi } from 'gapi-script';
import Equipmentbooking from './pages/Equipment/Equipmentbooking';
import './App.css';
import ManagementDashboard from './pages/ManagementDashboard/ManagementDashboard';
import Summary from './components/PaymentComp/Summary';
import TeamSports from './pages/Teamsports/teamsports';
import IndividualSports from './pages/IndividualSports/Individual';
import GroupEX from './pages/GroupEx/groupex';
import Aquatics from './pages/Aquatics/Aquatics';
import BookingFailure from './components/PaymentComp/BookingFailure';
import BookingSuccess from './components/PaymentComp/BookingSuccess';
import Map from './pages/Map/Map';
import Map_home from './pages/Map/Map_home';
import BookingInfo from './components/BookingInfo/BookingInfo'
import Membership from './pages/Membership/Membership'
import Usersearch from './components/BookingActivities/Usersearch';

const clientId = "936293186215-ob0hbo1v1stu86cubul22oqd05605ts1.apps.googleusercontent.com";
function App() {
  /*useEffect(() => {
    function start(){
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };
    gapi.load('client:auth2', start);
  }
  );*/
  const [firstname, setFirstName] = useState('');
  const [user, setUser] = useState({ email: null });
  return (
    
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path = "/Forgotpassword" element={<Forgot />} />
        <Route path='/api/reset-password/:id' element={<Resetpassword/>}/>
        <Route path='/UserDashboard' element={<UserDashboard/>}/>
        <Route path='/Userprofile' element={<UserProfile/>}/>
        <Route path='/Userprofileedit' element={<UserProfileEdit/>}/>
        <Route path='/ManagementDashboard' element={<ManagementDashboard/>}/>
        <Route path='/EmployeeDashboard' element={<EmployeeDashboard/>}/>
        <Route path="/search" element={<Search />} />
        <Route path="/displayFranchises" element={<DisplayFranchises />} />
        <Route path="/whyJoinUs" element={<WhyJoinUs />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path='/chatpage' element={<ChatsPage />} />
        <Route path='/Bookings' element={<Bookings />} />
        <Route path='/Slots1' element={<Slots1 />} />
        <Route path = "/map" element = {<Map />} />
        <Route path="/Summary" element={<Summary />}/> 
        <Route path="/TeamSports" element={<TeamSports />}/>
        <Route path="/Aquatics" element={<Aquatics />}/>
        <Route path="/IndividualSports" element={<IndividualSports />}/>
        <Route path="/GroupEX" element={<GroupEX />}/>
        <Route path="/Equipmentbooking" element={<Equipmentbooking />}/>
        <Route path="/BookingSuccess" element={<BookingSuccess />}/>
        <Route path="/BookingFailure" element={<BookingFailure />}/>
        <Route path="/Booking/:id" element = {<BookingInfo/>} />
        <Route path ="/Membership" element={<Membership/>} />
        <Route path ="/Map_home" element={<Map_home/>} />
        <Route path ="/Usersearch" element={<Usersearch/>}/>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    
  )
}

export default App;
