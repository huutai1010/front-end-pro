import { Box, Typography, alpha } from "@mui/material";
import { theme } from "../../styles/theme";
import moment from "moment";

const users = [
  {
    field: "id",
    headerName: "UserID",
    headerAlign: "center",
    width: 80,
    align: "center",
  },
  { field: "fullName", headerName: "Full Name", flex: 1 },
  { field: "nationality", headerName: "National", width: 150 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "gender", headerName: "Gender", width: 150 },
  {
    field: "createTime",
    headerName: "Create Time",
    headerAlign: "right",
    align: "right",
    flex: 1,
    renderCell: (params) => {
      return moment(params.row.createTime).format("DD MMMM, YYYY");
    },
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    align: "center",
    width: 150,
    renderCell: (params) => {
      if (params.row.status === 1) {
        return (
          <Box
            border={1}
            borderRadius={20}
            width={80}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderColor={alpha(theme.palette.text.onStatus, 0.1)}
            bgcolor={alpha(theme.palette.text.onStatus, 0.1)}
          >
            <Typography
              variant="span"
              fontWeight="medium"
              color={theme.palette.text.onStatus}
            >
              Active
            </Typography>
          </Box>
        );
      } else {
        return (
          <Box
            border={1}
            borderRadius={20}
            width={80}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderColor={alpha(theme.palette.text.active, 0.1)}
            bgcolor={alpha(theme.palette.text.active, 0.1)}
          >
            <Typography
              variant="span"
              fontWeight="medium"
              color={theme.palette.text.active}
            >
              Inactive
            </Typography>
          </Box>
        );
      }
    },
  },
];

export default users;
