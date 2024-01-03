import { Typography } from "@mui/material";

const subPlaces = [
  {
    field: "name",
    headerName: "Place Name",
    flex: 1,
    sortable: false,
  },
  {
    field: "category",
    headerName: "Category",
    headerAlign: "center",
    align: "center",
    width: 100,
    sortable: false,
    renderCell: (params) => {
      return (
        <Typography textTransform="capitalize" fontSize={14}>
          {params.row.category}
        </Typography>
      );
    },
  },
  {
    field: "price",
    headerName: "Price",
    headerAlign: "center",
    align: "center",
    width: 100,
    sortable: false,
    renderCell: (params) => {
      return (
        "$" +
        params.row.price.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      );
    },
  },
];
export default subPlaces;
