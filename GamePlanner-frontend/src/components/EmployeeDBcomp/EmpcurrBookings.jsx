import React, { useAuth } from '../../Context/AuthContext';
function EmpCurrentBookings(){

    const {user}=useAuth();

    return (
 
            <table class="table table-hover my-0">
                <thead >
                <tr>
                    <th>Customer</th>
                    <th>Activity</th>
                    <th>Booking</th>
                    <th>Court</th>
                    <th>Date</th>
                </tr>
                </thead>
                
                <tbody>
                        {user && user.currBookings.map((item, index) => (
                    <tr key={index}>
                    <td>{item.customer}</td>
                    <td>{item.activity}</td>
                    <td><span class="badge bg-success">{item.startTime}</span></td>
                    <td>{item.room}</td>
                    <td>{item.date}</td>
                    </tr>
                    ))}
                        </tbody>


            </table>
        
        

    );
}
export default EmpCurrentBookings;