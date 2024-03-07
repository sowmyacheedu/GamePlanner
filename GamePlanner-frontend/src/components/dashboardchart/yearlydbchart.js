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
import Cookies from "universal-cookie";
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
    indexAxis: 'y',
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

const Yearlydbchart =() => {

    const [chartdata,setChartData]=useState([]);
    const cookies = new Cookies();
    const [data, setData] = useState({
        labels:['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [
          {
            label: 'Dataset 1',
            data:[],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(25, 90, 13, 0.5)',
          },
          {
            label: 'Dataset 2',
            data:[],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      });
      useEffect(()=> {
        const fetchData= async()=> {
            const url = 'http://18.223.24.199:3000/api/manageDash'

            
            const options = {  method: "POST", headers: {
              'Authorization': 'Bearer '+cookies.get("jwt_authorization"),
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8"},  body: JSON.stringify({email:"scott@outlook.com"}),};
            const labelSet = []
            const dataSet1 = [];
            const dataSet2 = [];
          await fetch(url,options).then((data)=> {
              console.log("Api data", data)
              const res = data.json();
              return res
          }).then((res) => {
              console.log("yearlyressss", res)
            //  for (const val of res.data) {
                 dataSet1.push(res.sales);
                 dataSet2.push(res.expenses)
                labelSet.push(res.data.year)
            //  }
             setData({
              labels: labelSet,//['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                 datasets: [
                   {
                     label: 'Dataset ID',
                     data:dataSet1,
                     backgroundColor: 'rgba( 33, 47, 60)',
                    //  borderColor: 'rgb(255, 99, 132)',
                     
                   },
                   {
                     label: 'Dataset ID2',
                     data:dataSet2,
                    //  borderColor: 'rgb(53, 162, 235)',
                     backgroundColor: 'rgba(122, 130, 139)',
                   },
                 ],
               })
             console.log("arrData", dataSet1, dataSet2)
          }).catch(e => {
                 console.log("error", e)
             })
         }
         
         fetchData();
     },[])
    return(
        <div style={{width:'50%', height:'50%'}}>
            {
                // console.log("dataaaaaaaa", data)
            }
            <Bar  data={data} options={options}/>
         </div>)
}
export default Yearlydbchart;