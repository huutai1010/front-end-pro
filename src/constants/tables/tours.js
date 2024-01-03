import { Box, Typography, Rating, alpha } from "@mui/material";
import dayjs from "dayjs";
import { theme } from "../../styles/theme";

const tours = [
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
    headerName: "Itinerary Name",
    sortable: false,
    flex: 2,
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
    field: "totalPlace",
    headerName: "Num of Places",
    sortable: false,
    headerAlign: "center",
    align: "center",
    flex: 1,
  },
  {
    field: "rate",
    headerName: "Rating",
    sortable: false,
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: (params) => {
      if (params.row.rate === 0 || params.row.rate === null) {
        return (
          <Typography fontSize={12} color={theme.palette.text.third}>
            No reviews
          </Typography>
        );
      } else
        return (
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
      let color = theme.palette.text.active;
      if (params.row.status === 0) {
        color = theme.palette.text.active;
      } else if (params.row.status === 1) {
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
export default tours;
