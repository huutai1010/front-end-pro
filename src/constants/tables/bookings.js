import { Box, Typography, alpha } from "@mui/material";
import dayjs from "dayjs";
import { theme } from "../../styles/theme";

import { TimeFive } from "@styled-icons/boxicons-regular";

const bookings = [
  {
    field: "id",
    headerName: "No.",
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return params.api.getAllRowIds().indexOf(params.id) + 1;
    },
    width: 50,
  },
  {
    field: "customerName",
    headerName: "Customer Name",
    sortable: false,
    flex: 1.5,
  },
  {
    field: "totalPlace",
    headerName: "Num Of Places",
    sortable: false,
    headerAlign: "center",
    align: "center",
    flex: 1,
  },
  {
    field: "total",
    headerName: "Price",
    sortable: false,
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: (params) => {
      return (
        "$" +
        params.row.total.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      );
    },
  },
  {
    field: "totalTime",
    headerName: "Total Estimated Time",
    sortable: false,
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: (params) => {
      return (
        <Box display="flex" alignItems="center" gap={1}>
          <TimeFive width={14} />{" "}
          {params.row.totalTime
            .toFixed(1)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
          h
        </Box>
      );
    },
  },
  {
    field: "createTime",
    headerName: "Create Time",
    sortable: false,
    headerAlign: "right",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      return dayjs(params.row.createTime).format("ll");
    },
  },
  {
    field: "status",
    headerName: "Status",
    sortable: false,
    headerAlign: "center",
    align: "center",
    width: 100,
    renderCell: (params) => {
      let color = theme.palette.text.primary;
      if (params.row.status === 0) {
        color = theme.palette.text.primary;
      } else if (params.row.status === 1) {
        color = theme.palette.text.onStatus;
      } else if (params.row.status === 2) {
        color = theme.palette.text.checked;
      } else if (params.row.status === 3) {
        color = theme.palette.text.pending;
      } else if (params.row.status === 4) {
        color = theme.palette.text.onStatus;
      } else if (params.row.status === 5) {
        color = theme.palette.text.active;
      }

      return (
        <Box
          border={1}
          borderRadius={20}
          paddingX={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderColor={alpha(color, 0.1)}
          bgcolor={alpha(color, 0.1)}
        >
          <Typography
            variant="span"
            fontWeight="medium"
            color={color}
            textTransform="capitalize"
          >
            {params.row.statusType}
          </Typography>
        </Box>
      );
    },
  },
];
export default bookings;
