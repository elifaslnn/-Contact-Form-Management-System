import { CssBaseline, Typography } from "@mui/material";
import * as React from "react";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";

// const barChartsProps = {
//   series: [
//     {
//       data: [3, 4, 1, 6, 5],
//       id: "sync",
//       highlightScope: { highlighted: "item", faded: "global" },
//     },
//   ],
//   xAxis: [{ scaleType: "band", data: ["A", "B", "C", "D", "E"] }],
//   height: 400,
//   slotProps: {
//     legend: {
//       hidden: true,
//     },
//   },
// };

function Reports() {
  const [highlightedItem, setHighLightedItem] = React.useState(null);
  const [messages, setMessages] = useState([]);
  const countryCounts = {};
  const country = [];
  const genderCounts = {};
  const gender = [];

  const [barChartsProps, setBarChartsProps] = useState({
    series: [
      {
        data: [],
        id: "sync",
        highlightScope: { highlighted: "item", faded: "global" },
      },
    ],
    xAxis: [{ scaleType: "band", data: [] }],
    height: 400,
    slotProps: {
      legend: {
        hidden: true,
      },
    },
  });

  const [barChartsPropsGender, setBarChartsPropsGender] = useState({
    series: [
      {
        data: [],
        id: "sync",
        highlightScope: { highlighted: "item", faded: "global" },
      },
    ],
    xAxis: [{ scaleType: "band", data: [] }],
    height: 400,
    slotProps: {
      legend: {
        hidden: true,
      },
    },
  });

  useEffect(() => {
    const getCountries = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5165/api/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const messages = data.data.messages;
        setMessages(messages);

        messages.map((message, index) => {
          country.push(message.country);
          gender.push(message.gender);
        });
        country.forEach(function (x) {
          countryCounts[x] = (countryCounts[x] || 0) + 1;
        });
        gender.forEach(function (x) {
          genderCounts[x] = (genderCounts[x] || 0) + 1;
        });

        console.log(countryCounts);
        const countries = Object.keys(countryCounts);
        const counts = Object.values(countryCounts);

        const genders = Object.keys(genderCounts);
        const countsg = Object.values(genderCounts);

        console.log(counts);
        setBarChartsProps((prevProps) => ({
          ...prevProps,
          series: [
            {
              ...prevProps.series[0],
              data: counts,
            },
          ],
          xAxis: [{ scaleType: "band", data: countries }],
        }));

        setBarChartsPropsGender((prevProps) => ({
          ...prevProps,
          series: [
            {
              ...prevProps.series[0],
              data: countsg,
            },
          ],
          xAxis: [{ scaleType: "band", data: genders }],
        }));
      } else if (response.status == 401) {
        console.log("401");
      } else if (response.status == 403) {
      }
    };
    getCountries();
  }, [messages]);

  return (
    <>
      <CssBaseline />
      <div className="container">
        {" "}
        <Stack
          direction={{ xs: "column", xl: "row" }}
          spacing={1}
          sx={{ width: "100%" }}
        >
          <Typography>
            {" "}
            Country Graph <br />
          </Typography>
          <BarChart
            {...barChartsProps}
            highlightedItem={highlightedItem}
            onHighlightChange={setHighLightedItem}
          />
          <Typography>
            {" "}
            Gender Graph <br />
          </Typography>
          <BarChart
            {...barChartsPropsGender}
            highlightedItem={highlightedItem}
            onHighlightChange={setHighLightedItem}
          />
        </Stack>
      </div>
    </>
  );
}

export default Reports;
