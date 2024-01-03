import { Box, Typography, alpha } from "@mui/material";
import { theme } from "../../styles/theme";
import dayjs from "dayjs";

import { TimeFive } from "@styled-icons/boxicons-regular";

const places = [
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
    field: "name",
    headerName: "Place Name",
    sortable: false,
    flex: 2,
  },
  {
    field: "languageList",
    headerName: "Num of Languages",
    sortable: false,
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: (params) => params.row.languageList?.length,
  },
  {
    field: "price",
    headerName: "Price",
    sortable: false,
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: (params) => {
      return (
        "$" +
        params.row.price.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      );
    },
  },
  {
    field: "duration",
    headerName: "Duration",
    sortable: false,
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: (params) => {
      return (
        <Box display="flex" alignItems="center" gap={1}>
          <TimeFive width={14} />
          {params.row.duration
            .toFixed(2)
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
    renderCell: (params) => dayjs(params.row.createTime).format("ll"),
  },
  {
    field: "status",
    headerName: "Status",
    sortable: false,
    headerAlign: "center",
    align: "center",
    width: 100,
    renderCell: (params) => {
      let color = theme.palette.text.active;
      if (params.row.status === 0) {
        color = theme.palette.text.active;
      } else if (params.row.status === 1) {
        color = theme.palette.text.pending;
      } else if (params.row.status === 2) {
        color = theme.palette.text.onStatus;
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
export default places;
