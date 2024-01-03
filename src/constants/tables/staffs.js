import { Box, Typography, alpha } from "@mui/material";
import { theme } from "../../styles/theme";
import dayjs from "dayjs";

const staffs = [
  {
    field: "id",
    headerName: "No.",
    sortable: false,
    headerAlign: "center",
    width: 50,
    align: "center",
  },
  { field: "fullName", headerName: "Full Name", sortable: false, flex: 1 },
  { field: "gender", headerName: "Gender", sortable: false, width: 120 },
  { field: "role", headerName: "Role", sortable: false, width: 120 },
  { field: "phone", headerName: "Phone", sortable: false, width: 150 },
  { field: "email", headerName: "Email", sortable: false, width: 200 },
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

export default staffs;
