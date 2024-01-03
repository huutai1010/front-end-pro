import { Box, Tabs, Tab, Typography, Skeleton, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { TooltipComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import dayjs from "dayjs";

const ChartUserAnalysis = ({
  loading,
  loadingData,
  loadingSelect,
  time,
  data,
  option,
  setLoadingSelect,
  setOption,
}) => {
  const theme = useTheme();

  useEffect(() => {
    let arrTime = [],
      arrTotal = [];

    data?.forEach((item) => {
      arrTime.push(dayjs(item.date).format("MMMM"));
      arrTotal.push(item.totalUser);
    });

    if (!loading) {
      echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);
      const chartDom = document.getElementById("userChart");
      const myChart = echarts.init(chartDom);

      const options = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: arrTime,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            max: 10,
            interval: 2,
          },
        ],
        series: [
          {
            name: "New user in month:",
            type: "bar",
            barWidth: "60%",
            data: arrTotal,
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
          <Typography fontWeight="medium" textTransform="capitalize">
            Number of new registered users
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
                value={3}
                label="3m"
                disabled={(time !== null && time.length !== 0) || loadingSelect}
                sx={{ minWidth: 50, minHeight: 25, padding: 0 }}
              />
              <Tab
                value={6}
                label="6m"
                disabled={(time !== null && time.length !== 0) || loadingSelect}
                sx={{ minWidth: 50, minHeight: 25, padding: 0 }}
              />
              <Tab
                value={1}
                label="1y"
                disabled={(time !== null && time.length !== 0) || loadingSelect}
                sx={{ minWidth: 50, minHeight: 25, padding: 0 }}
              />
            </Tabs>
          )}
        </Box>
      </Box>

      <Box padding={0.5}>
        {loading ? (
          <Skeleton variant="rounded" width="100%" height={400} />
        ) : (
          <Box
            id="userChart"
            width="100%"
            maxWidth={1000}
            height="100%"
            minHeight={300}
          />
        )}
      </Box>
    </Box>
  );
};

export default ChartUserAnalysis;
