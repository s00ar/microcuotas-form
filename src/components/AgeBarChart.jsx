import React from 'react'
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart
} from "recharts";
import { Tooltip } from "recharts";

export default function AgeBarChart({AgeChartData}) {
    const getIntroOfPage = (label) => {
  if (label === "Age 1-15") {
    return "Number of people between 1 and 15 years old";
  }
  if (label === "Age 16-30") {
    return "Number of people between 16 and 30 years old";
  }
  if (label === "Age 31-60") {
    return "Number of people between 31 and 60 years old";
  }
  if (label === "Age 60+") {
    return "Number of people older than 60 years old";
  }
  else 
  return "";
};

    const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
        <p className="intro">{getIntroOfPage(label)}</p>
      
      </div>
    );
  }

  return null;
};

  return (
    <div className='ChartContainer'>
      <h2>
        Número total de usuarios : {AgeChartData.reduce((acc, item) => acc + item.uv, 0)}
      </h2>
            <BarChart
              width={500}
              height={400}
              data={AgeChartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {/* <Legend /> */}
              <Bar dataKey="uv" barSize={35} fill="#82ca9d" />
            </BarChart>
            <h2>Usuario por grupo de edad</h2>
          </div>
  )
}
