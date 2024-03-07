import React from 'react';
import Map from '../../components/Map/Map';
import HomeNavbar from '../../components/Homenavbar/homeNavbar';

export default function Map_home() {
    return (
    <>
    <div className='wrapper'> 
        <div className='main' >
            <HomeNavbar />
            <main class="content">
                <div class="container-fluid p-0" style={{height: "100%",display:'flex' ,flexWrap:'wrap', marginTop:'40px'}}>
                    <Map/>
                </div>
            </main>
        </div>
    </div>
    </>
    )
};