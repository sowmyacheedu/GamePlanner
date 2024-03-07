import React, { useState,useContext,useEffect } from 'react';
import Map from '../../components/Map/Map';
import Sidebardb from "../../components/Sidebardb/Sidebardb";
import Usernavbar from "../../components/usernavbar/usernavbar";

export default function MapPage() {
    const[isOpen ,setIsOpen] = useState();
    const onclick = (v) => {
    console.log("variable",v);
    setIsOpen(v);
    }
    return (
    <>
    <div className='wrapper'> 
        {isOpen &&  <Sidebardb />}
        <div className='main' >
            <Usernavbar onClick={onclick}/>
            <main class="content">
                <div class="container-fluid p-0" style={{height: "100%",display:'flex' ,flexWrap:'wrap'}}>
                    <Map/>
                </div>
            </main>
        </div>
    </div>
    </>
    )
};