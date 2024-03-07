import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeNavbar from '../../components/Homenavbar/homeNavbar';
import Footer from '../../components/Footer/footer';
import './displayFranchises.css';
import Cookies from "universal-cookie";

function DisplayFranchises() {
  
  const { location } = useAuth();
  const [franchises, setFranchises] = useState();
  const { franchiseFunction } = useAuth();
  const [sortBy, setSortBy] = useState("distance");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const cookies = new Cookies();
  
  const param = { location : location , type : sortOrder};
  const fetchFranchises = async () => {
    try {
      if (sortBy === "distance") {
        const response = await axios.put(`http://18.223.24.199:3000/api/franchisesByDistance`, param, { headers: {
          'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
          'Content-Type': 'application/json'
        }});
        if (response.data.success) {
          setFranchises(response.data.data.franchises);
          console.log(response.data.data);
        } 
        else {
          console.log("errorrr");
        }
      }
      else {
        const params = { location : location, type : sortOrder}
        const response = await axios.put(`http://18.223.24.199:3000/api/franchisesByPrice`, params, { headers: {
          'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
          'Content-Type': 'application/json'
        }});
        if (response.data.success) {
          setFranchises(response.data.data.franchises);
          console.log(response.data.data);
        } 
        else {
          console.log("errorrr");
        }
      }
    } catch (error) {
      console.error(error);
    } 
  };
  useEffect(() => {
    fetchFranchises();
  }, [sortBy, sortOrder]);

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };


  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleClick = (franchise) => {
    franchiseFunction(franchise);
    navigate('/register');
  };

  return (
    <div>
        <HomeNavbar />
        <h1>SELECT A FACILITY</h1>
        <div className="filter-container">
        <div className="filter-section">
          <div className="filter-title">Sort by:</div>
          <div className="radio-buttons-container">
            <div className="radio-container">
              <input
                type="radio"
                id="distance"
                name="sort-by"
                value="distance"
                checked={sortBy === "distance"}
                onChange={handleSortByChange}
              />
              <label htmlFor="distance">Distance</label>
            </div>
            <div className="radio-container">
              <input
                type="radio"
                id="price"
                name="sort-by"
                value="price"
                checked={sortBy === "price"}
                onChange={handleSortByChange}
              />
              <label htmlFor="price">Price</label>
            </div>
          </div>
        </div>
        <div className="filter-section">
          <div className="filter-title">Sort order:</div>
          <div className="radio-buttons-container">
            <div className="radio-container">
              <input
                type="radio"
                id="asc"
                name="sort-order"
                value="asc"
                checked={sortOrder === "asc"}
                onChange={handleSortOrderChange}
              />
              <label htmlFor="asc">Ascending</label>
            </div>
            <div className="radio-container">
              <input
                type="radio"
                id="des"
                name="sort-order"
                value="des"
                checked={sortOrder === "des"}
                onChange={handleSortOrderChange}
              />
              <label htmlFor="des">Descending</label>
            </div>
          </div>
        </div>
      </div>
        <div className='franchises-container'>
            {franchises && franchises.map((item) => (
            <div key={item.name} onClick={() => handleClick(item)} style={{ cursor: 'pointer' }}>
                <div className = "franchise">
                    <div className='franchiseName'>{item.name}</div>
                    <div className='franchiseAddress'>{item.address.streetAddress}, {item.address.city}, {item.address.state}, {item.address.postalCode}</div>
                    {item.distance && <div className='franchiseDistance'>{item.distance} miles</div>}
                    <br></br>
                    <div className='franchisePrice'>{'$' + item.price}</div>
                </div>
            </div>
      ))}
      </div>
      <Footer />
    </div>
  );
}

export default DisplayFranchises;
