import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBaseball,
  faClipboard,
  faRunning
} from "@fortawesome/free-solid-svg-icons";
import {
  faCalendar,
  faCalendarDays,
} from "@fortawesome/free-regular-svg-icons";

// For date picker
import { DateRange } from "react-date-range";
import { useContext, useState } from "react";

// Date picker package
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Header = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setopenDate] = useState(false);
  const [openPersonOptions, setOpenPersonOptions] = useState(false);
  const [personOptions, setPersonOptions] = useState({
    adult: 1,
    children: 0,
  });
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const navigate = useNavigate();

  const handleOption = (name, operation) => {
    setPersonOptions((prev) => {
      return {
        ...prev,
        [name]:
          operation === "i" ? personOptions[name] + 1 : personOptions[name] - 1,
      };
    });
  };

  /*
Should navigate to parks search page. Need to send destination, date, options
*/

  const handleSearch = () => {
    navigate("/");
    // navigate("/parks", { state: { destination, date, personOptions } });
  };

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList">
          <div className="headerListItem active">
            <FontAwesomeIcon icon={faCalendar} />
            <span>Schedule</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faBaseball} />
            <span>Court Availability</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faClipboard} />
            <span>Passes</span>
          </div>
        </div>
        <div><h3 className="desc">One Stop for all your Game plans....!</h3></div>
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faRunning} className="headerIcon" />
                <input
                  type="text"
                  placeholder="Sports"
                  className="headerSearchInput"
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
         
        
      </div>
    </div>
  );
};

export default Header;
