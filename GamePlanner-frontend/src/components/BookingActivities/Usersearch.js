import React, { useState,useEffect } from 'react';
import { useAuth} from '../../Context/AuthContext';
import Cookies from 'universal-cookie';
import axios from 'axios';
export default function Usersearch() {
    const { user } = useAuth();
    const [users,setusers] = useState();
    const [selectedusers,setselectedusers] = useState();
    const [showdiv,setshowdiv] = useState(false);
    const {BookingData,setBookingData}=useAuth();
    const cookies=new Cookies();
const fetchusers = async() => {
    try {
      //   const params= {'email': user.email};
      console.log("APICALL");
      const response = await axios.get(`http://18.223.24.199:3000/api/getUsers/${user.email}
      `,{ headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
        'Content-Type': 'application/json'
      }});
      if (response.data.success) {
        setusers(response.data.data);
        console.log("USERS",users);
      }
      console.log(user);
    } catch (error) {
      console.error(error);
    } 
  };

  useEffect(() => {
     fetchusers();
       },[]);

       useEffect(() => {
        const BookinguserData = {
          "email": selectedusers,
        }
        setBookingData(BookinguserData);
      }, [selectedusers]);
      
const handleuserChange = (event) => {
    console.log("onlickfunction");
    setselectedusers(event.target.value);

    // const BookinguserData={
    //     "email": selectedusers,
    //   }
    //   setBookingData(BookinguserData);
  };  
  console.log("SELECTEDUSER",selectedusers);
  console.log("BBOOOOKINGDATA",BookingData)
  return (
    <div>
    <label htmlFor="rooms">Users:</label>
    <select name="users" id="users" onChange={handleuserChange}>
      {users && users.map(users => (
        <option value={users} key={users}>{users}</option>
      ))}
    </select>
  </div>
  )
      }