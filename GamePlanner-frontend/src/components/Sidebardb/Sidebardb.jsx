import { useNavigate } from 'react-router-dom';
import {useAuth} from '../../Context/AuthContext';
 function Sidebardb(props){
	const {user}=useAuth();
	const navigate = useNavigate(); 
const handlebookingpage=()=>{
		navigate('/Bookings');
}
const handleteamsportpage=()=>{
	navigate('/Teamsports');
}
const handleGroupEx=()=>{
	navigate('/GroupEx');
}
const handleMap=()=>{
	navigate('/Map');
}
const handlechat=()=>{
	navigate('/chatpage');
}
const handleIndividual=()=>{
	navigate('/IndividualSports');
}
const handleaquatics=()=>{
	navigate('/Aquatics');
}
const handledashboard=()=>{
	if (user.userType === "Customer") {
        navigate("/UserDashboard");
      } else if (user.userType === "Staff") {
        navigate("/EmployeeDashboard");
      } else if (user.userType === "Management") {
        navigate("/ManagementDashboard");
      }
}
const handlemembership=()=>{
	navigate('/Membership');
}



    return (
        <nav id="sidebar" className="sidebar js-sidebar" style={{width:'200px'}}>
			<div className="sidebar-content js-simplebar">

          <span className="align-middle"></span>

				<ul className="sidebar-nav">
					<li className="sidebar-header">
						General 
					</li>

					<li className="sidebar-item" >
						<a className="sidebar-link" href="/">
              <i className="align-middle"   data-feather="sliders"></i> <span className="align-middle" >Home</span>
            </a>
					</li>

                    <li className="sidebar-item" >
						<a className="sidebar-link" onClick={handledashboard}>
              <i className="align-middle" data-feather="sliders"></i> <span className="align-middle">Dashboard</span>
            </a>
					</li>

					<li className="sidebar-item" >
						<a className="sidebar-link" href="/AboutUs">
              <i className="align-middle" data-feather="user"></i> <span className="align-middle">About Us</span>
            </a>
					</li>


					<li className="sidebar-item">
						<a className="sidebar-link" onClick={handlemembership}>
              <i className="align-middle" data-feather="user-plus"></i> <span className="align-middle">Memberships & Passes</span>
            </a>
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" onClick={handlebookingpage} >
              <i className="align-middle" data-feather="book"></i> <span className="align-middle">Bookings</span>
            </a>
					</li>

					<li className="sidebar-header">
						Sports & Activities
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" onClick={handleteamsportpage}>
              <i className="align-middle" data-feather="square"></i> <span className="align-middle">Team Sports</span>
            </a>
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" onClick={handleIndividual}>
              <i className="align-middle" data-feather="grid"></i> <span className="align-middle">Individual Sports</span>
            </a>
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" onClick={handleaquatics}>
              <i className="align-middle" data-feather="check-square"></i> <span className="align-middle">Aquatics</span>
            </a>
					</li>

					

					<li className="sidebar-item">
						<a className="sidebar-link" onClick={handleGroupEx}>
              <i className="align-middle" data-feather="align-left"></i> <span className="align-middle">Group Exercise</span>
            </a>
					</li>

					{/* <li className="sidebar-item">
						<a className="sidebar-link" href="/">
              <i className="align-middle" data-feather="coffee"></i> <span className="align-middle">Summary</span>
            </a>
					</li> */}
                    {/* <li className="sidebar-item">
						<a className="sidebar-link" href="/testing">
              <i className="align-middle" data-feather="coffee"></i> <span className="align-middle">Strength & Cardio</span>
            </a>
					</li> */}

					<li className="sidebar-header">
						Miscellaneous
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" onClick={handlechat}>
              <i className="align-middle" data-feather="bar-chart-2"></i> <span className="align-middle">Chat</span>
            </a>
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" onClick={handleMap}>
              <i className="align-middle" data-feather="map"></i> <span className="align-middle">Map</span>
            </a>
					</li>
				</ul>

				
			</div>
		</nav>
    )
 }
 export default Sidebardb;