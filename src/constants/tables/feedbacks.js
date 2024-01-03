import { Box, Rating, Tooltip, Typography, alpha } from "@mui/material";
import { theme } from "../../styles/theme";

import dayjs from "dayjs";

const feedbacks = [
  {
    field: "id",
    headerName: "No.",
    sortable: false,
    align: "center",
    renderCell: (params) => {
      return params.api.getAllRowIds().indexOf(params.id) + 1;
    },
    width: 50,
  },
  {
    field: "userName",
    headerName: "Customer Name",
    sortable: false,
    flex: 0.5,
  },

  {
    field: "category",
    headerName: "Category",
    sortable: false,
    renderCell: (params) => {
      return (
        <Typography variant="span" textTransform="capitalize">
          {params.row.category}
        </Typography>
      );
    },
  },
  {
    field: "rate",
    headerName: "Rating",
    headerAlign: "center",
    align: "center",
    sortable: false,
    renderCell: (params) => {
      return (
        <Tooltip title={`${params.row.rate} stars`}>
          <Rating
            readOnly
            size="small"
            value={params.row.rate || 0}
            precision={0.5}
            sx={{
              ".MuiRating-icon": {
                borderColor: theme.palette.text.active,
              },
              "& .MuiRating-iconFilled": {
                color: theme.palette.text.active,
              },
            }}
          />
        </Tooltip>
      );
    },
  },
  {
    field: "content",
    headerName: "Comment",
    flex: 1.5,
    sortable: false,
  },
  {
    field: "createTime",
    headerName: "Create Time",
    headerAlign: "right",
    align: "right",
    width: 130,
    sortable: false,
    renderCell: (params) => {
      return dayjs(params.row.createTime).format("ll");
    },
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    align: "center",
    sortable: false,
    width: 100,
    renderCell: (params) => {
      let color = "";
      if (params.row.status === 0) {
        color = theme.palette.text.active;
      } else if (params.row.status === 1) {
        color = theme.palette.text.onStatus;
      }
      return (
        <Box
          border={1}
          borderRadius={20}
          paddingX={1.5}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderColor={alpha(color, 0.1)}
          bgcolor={alpha(color, 0.1)}
        >
          <Typography variant="span" fontWeight="medium" color={color}>
            {params.row.status === 1 ? "Show" : "Hidden"}
          </Typography>
        </Box>
      );
    },
  },
];
export default feedbacks;
