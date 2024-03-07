import Cookies from "universal-cookie";
import {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
const options = {
    indexAxis: 'x',
    height: '400px' ,
    width: '800px' ,

    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "center",
        
      },
      title: {
        display: true,
        // text: 'Chart.js Horizontal Bar Chart',
      },
    },
  };

function Dbchart (props) {
    const [input,setInput]=useState({});
    console.log("propsdata",props.data);
    console.log("parentdata",input);
    //setInput(props.data);
    
    const cookies = new Cookies();
    const [chartdata,setChartData]=useState([]);
    const [data, setData] = 
    useState({
        labels:[],
        datasets: [
          {
            label: '',
            data:[],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(25, 90, 13, 0.5)',
          },
          {
            label: '',
            data:[],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      });
      useEffect(()=> {
        
        setInput(props.data);
        console.log("parentdata22222",input);
        //console.log(props.data)
        const fetchData= async()=> {
            const url = 'http://18.223.24.199:3000/api/manageDash';


            const options = {  method: "POST", headers: {
              'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8"},  body: JSON.stringify(input)};
            const labelSet = [];
            const dataSet1 = [];
            const dataSet2 = [];

          await fetch(url,options).then((data)=> {
              console.log("Api data", data);

              const res = data.json();
              return res
          }).then((res) => {
              console.log("ressss", res);
              
             for (const val of res.data.monthlyData) {
                 dataSet1.push(val.sales);
                 dataSet2.push(val.expenses);
                    labelSet.push(val.month);
             }
             setData({
              labels: labelSet,//['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                 datasets: [
                   {
                     label: 'Sales',
                     data:dataSet1,
                     backgroundColor: 'rgba( 33, 47, 60)',
                    //  borderColor: 'rgb(255, 99, 132)',
                     
                   },
                   {
                     label: 'Expenses',
                     data:dataSet2,
                    //  borderColor: 'rgb(53, 162, 235)',
                     backgroundColor: 'rgba(122, 130, 139)',
                   },
                 ],
               })
             console.log("arrData", dataSet1, dataSet2);
          }).catch(e => {
                 console.log("error", e);
             })
         }
         
         fetchData();
     },[props]);
    return(
        <div style={{width:'100%', height:'50%', justifyContent:'center'}}>
            {
                // console.log("dataaaaaaaa", data)
            }
            <Bar  data={data} options={options}/>
         </div>)
}
export default Dbchart;