import { Box, Typography, alpha } from "@mui/material";
import moment from "moment";
import { theme } from "../../styles/theme";
import paypal from "../../assets/paypal.png";
import mastercard from "../../assets/mastercard.png";

const transactions = [
  {
    field: "id",
    headerName: "No.",
    sortable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bookingId",
    headerName: "BookingID",
    sortable: false,
    headerAlign: "center",
    align: "center",
    width: 100,
  },
  {
    field: "customerName",
    headerName: "Customer Name",
    sortable: false,
    flex: 1.5,
  },
  {
    field: "paymentMethod",
    headerName: "Payment Method",
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return (
        <Box display="flex" alignItems="center" gap={1}>
          {params.row.paymentMethod === "PayPal" ? (
            <img src={paypal} width="20px" alt={params.row.paymentMethod} />
          ) : (
            <img src={mastercard} width="20px" alt={params.row.paymentMethod} />
          )}
          {params.row.paymentMethod}
        </Box>
      );
    },
    width: 50,
    flex: 1,
  },
  {
    field: "amount",
    headerName: "Amount",
    sortable: false,
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: (params) => {
      return (
        "$" +
        params.row.amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
      );
    },
  },

  {
    field: "createTime",
    headerName: "Payment Time",
    sortable: false,
    headerAlign: "right",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      return moment(params.row.createTime).format("lll");
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
        color = theme.palette.text.checked;
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
export default transactions;
