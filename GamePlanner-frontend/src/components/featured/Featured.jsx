import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./featured.css";

const Featured = () => {
  const navigate = useNavigate();
  // to set search context, as this is usually done by header.
  const [destination, setDestination] = useState("");
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

  function handleFeatureRedirect(natioanalState, redirectionURL) {
    setDestination(natioanalState);
    console.log("This is clicked.", destination, date, personOptions);
    navigate(redirectionURL);
  }

  return (
    <div className="featured">
      <div
        className="redirectionOpt"
        onClick={() =>
          handleFeatureRedirect("idaho", "/parks/yellowstone national park")
        }
      >
        <div className="featuredItem">
          <img
            src="https://www.history.com/.image/t_share/MTU3ODc4NjAzNzkyODUyNzAz/gettyimages-154931596-2.jpg"
            alt=""
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Yellowstone National Park</h1>
            <h2>Wyoming</h2>
          </div>
        </div>
      </div>
      <div
        className="redirectionOpt"
        onClick={() =>
          handleFeatureRedirect("arizona", "/parks/grand canyon national park")
        }
      >
        <div className="featuredItem">
          <img
            src="https://www.doi.gov/sites/doi.gov/files/styles/social_media_1200x627/public/blog-post/thumbnail-images/grandcanyonnpyanlismall.jpg?itok=mblEK74B"
            alt=""
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Grand Canyon National Park</h1>
            <h2>Arizona</h2>
          </div>
        </div>
      </div>
      <div
        className="redirectionOpt"
        onClick={() =>
          handleFeatureRedirect("california", "/parks/yosemite national park")
        }
      >
        <div className="featuredItem">
          <img
            src="https://www.history.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTU3ODc4NjAwMjkxNzIyNTY5/yosemite-3.jpg"
            alt=""
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Yosemite National Park</h1>
            <h2>California</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
