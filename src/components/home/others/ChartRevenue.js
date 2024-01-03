import { Box, Tabs, Tab, Typography, Skeleton, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

const ChartRevene = ({
  loading,
  loadingData,
  loadingSelect,
  time,
  data,
  total,
  option,
  setLoadingSelect,
  setOption,
}) => {
  const theme = useTheme();

  useEffect(() => {
    let arrTime = [],
      arrRevenue = [],
      arrBooking = [];
    data?.forEach((item) => {
      arrTime.push(item.date);
      arrRevenue.push(item.totalPrice);
      arrBooking.push(item.totalBooking);
    });
    if (!loading) {
      echarts.use([
        TooltipComponent,
        LegendComponent,
        GridComponent,
        BarChart,
        LineChart,
        CanvasRenderer,
        UniversalTransition,
      ]);
      const chartDom = document.getElementById("revenueChart");
      const myChart = echarts.init(chartDom);

      const options = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          bottom: 0,
          data: ["Revenue", "Booking"],
        },
        xAxis: [
          {
            type: "category",
            data: arrTime,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Revenue",
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: "{value} $",
            },
          },
          {
            type: "value",
            name: "Booking",
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: "Revenue",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value + " $";
              },
            },
            data: arrRevenue,
          },

          {
            name: "Booking",
            type: "line",
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + "";
              },
            },
            data: arrBooking,
          },
        ],
      };

      myChart.setOption(options);

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
  }, [loading, loadingData, data]);
  return (
    <Box
      bgcolor={theme.palette.background.secondary}
      borderRadius={2.5}
      padding={2}
      width="100%"
      height="100%"
    >
      <Box
        padding={0.5}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {loading ? (
          <Skeleton variant="rounded" width={100} />
        ) : (
          <Typography fontWeight="medium" fontSize={14}>
            Total revenue
          </Typography>
        )}

        <Box>
          {loading ? (
            <Skeleton variant="rounded" width={200} />
          ) : (
            <Tabs
              value={option}
              sx={{ minHeight: 25 }}
              onChange={(e, value) => {
                setOption(value);
                setLoadingSelect(true);
              }}
            >
              <Tab
                value={7}
                label="7d"
                disabled={(time !== null && time.length !== 0) || loadingSelect}
                sx={{ minWidth: 50, minHeight: 25, padding: 0 }}
              />
              <Tab
                value={1}
                label="1m"
                disabled={(time !== null && time.length !== 0) || loadingSelect}
                sx={{ minWidth: 50, minHeight: 25, padding: 0 }}
              />
              <Tab
                value={3}
                label="3m"
                disabled={(time !== null && time.length !== 0) || loadingSelect}
                sx={{ minWidth: 50, minHeight: 25, padding: 0 }}
              />
            </Tabs>
          )}
        </Box>
      </Box>
      <Box padding={0.5} marginLeft={2}>
        {loading ? (
          <Skeleton variant="rounded" width={200} height={40} />
        ) : (
          <Typography fontWeight="medium" variant="h5">
            {loadingData ? (
              <Skeleton variant="rounded" width={200} height={30} />
            ) : (
              `$ ${Number(total)
                .toFixed(2)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`
            )}
          </Typography>
        )}
      </Box>
      <Box padding={0.5}>
        {loading ? (
          <Skeleton variant="rounded" width="100%" height={400} />
        ) : (
          <Box
            id="revenueChart"
            width="100%"
            maxWidth={1000}
            height="100%"
            minHeight={450}
          />
        )}
      </Box>
    </Box>
  );
};

export default ChartRevene;
