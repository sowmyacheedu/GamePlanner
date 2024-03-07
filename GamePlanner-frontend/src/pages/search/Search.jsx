import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import HomeNavbar from "../../components/Homenavbar/homeNavbar";
import Footer from "../../components/Footer/footer";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useAuth } from '../../Context/AuthContext';
import "./Search.css";
import Cookies from "universal-cookie";

function Search() {
  const [address, setAddress] = React.useState("");
  const [ popularFranchises, setPopularFranchises ] = React.useState("");
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null,
  });
  const {locationFunction} = useAuth();
  const { franchiseFunction } = useAuth();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
    try {
      await locationFunction(latLng);
    } catch(error) {
        console.log(error.message);
    }
    console.log(results);
  };

  const fetchPopularFranchises = async () => {
    try {
      const response = await axios.put(`http://18.223.24.199:3000/api/popularFranchises`, { headers: {
        'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
        'Content-Type': 'application/json'
      }});
      if (response.data.success) {
        setPopularFranchises(response.data.data.franchises);
      }
    } catch (error) {
      console.error(error);
    } 
  };
  useEffect(() => {
    fetchPopularFranchises();
  }, []);
  useEffect(() => {
    handleSelect(address);
  }, []);


  const handleClick = (franchise) => {
    franchiseFunction(franchise);
    navigate('/register');
  };

  return (
    <div backgroundColor="blue">
    <div  className="search-container">
      <HomeNavbar />
      <div className="search-box" style={{align:'center',alignItems:'center',justifyContent:'center'}}>
        <h1 className="search-title">Find a Facility</h1>
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <div className="search-bar">
                <input {...getInputProps({ placeholder: "Type address" })}/>
                <div className="google-logo">
                  Google
                </div>
              </div>
              {!address && 
              <div classname="popularFranchises" style={{alignItems: 'center',width:'850px',display:'flex',flexWrap:'wrap',}}> Popular Franchises :
                {popularFranchises && popularFranchises.map((franchise) => (
                  <div classname="popularFranchise" style={{borderRadius:"20px",justifyContent: 'center', backgroundColor:'#212e3c',margin:"5px",color:'white',padding:"5px"
                   }} key={franchise.id} onClick={() => handleClick(franchise)}>{franchise.name}</div>
                ))}</div>}
              <div className="suggestions-box">
                {loading ? <div>...loading</div> : null}

                {suggestions.map((suggestion) => {
                  const style = {
                    backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                  };

                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, { style })}
                      className="suggestion"
                    >
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
        <button className="nextButton">
          <Link style={{color:'white'}} to="/displayFranchises" className="link">
            Next
          </Link>
        </button>
      <Footer />
    </div>
    </div>
  );
}

export default Search;
