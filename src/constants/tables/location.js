import { theme } from "../../styles/theme";
import { Rating } from "@mui/material";

const location = [
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
    flex: 1,
  },
  {
    field: "price",
    headerName: "Price",
    flex: 1,
    headerAlign: "center",
    align: "center",
    sortable: false,
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
  },

  {
    field: "rate",
    headerName: "Rating",
    sortable: false,
    headerAlign: "right",
    align: "right",
    flex: 0.75,
    renderCell: (params) => {
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
];
export default location;
