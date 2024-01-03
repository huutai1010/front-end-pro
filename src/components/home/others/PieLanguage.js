import { Box, Skeleton, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

const PieLanguage = ({ loading, loadingData, data }) => {
  const theme = useTheme();

  var arr = [];
  data.forEach((item) => arr.push({ value: item.quantity, name: item.name }));

  useEffect(() => {
    if (!loading) {
      echarts.use([
        PieChart,
        TitleComponent,
        TooltipComponent,
        LegendComponent,
        CanvasRenderer,
        LabelLayout,
      ]);

      const chartDom = document.getElementById("pie");
      const myChart = echarts.init(chartDom);

      const options = {
        title: {
          text: "Most Frequently Used Languages",
          subtext: "(Updated every 24 hours)",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          bottom: 10,
        },
        series: [
          {
            name: "Number of users using",
            type: "pie",
            radius: "50%",
            data: arr,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      myChart.setOption(options);

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadingData]);
  return (
    <Box
      bgcolor={theme.palette.background.secondary}
      borderRadius={2.5}
      padding={3}
      width="100%"
    >
      <Box padding={0.5}>
        {loading ? (
          <Skeleton variant="rounded" width="100%" height={250} />
        ) : (
          <Box id="pie" width="100%" maxWidth={800} height={338} />
        )}
      </Box>
    </Box>
  );
};

export default PieLanguage;
