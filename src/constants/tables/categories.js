import { Box, Typography, alpha } from "@mui/material";
import moment from "moment";
import { theme } from "../../styles/theme";

const categories = [
  {
    field: "id",
    headerName: "CategoryID",
    headerAlign: "center",
    width: 120,
    align: "center",
  },
  {
    field: "name",
    headerName: "Category Name",
    flex: 1,
  },
  {
    field: "totalLanguage",
    headerName: "Number of Languages",
    headerAlign: "center",
    align: "center",
    flex: 1,
  },
  {
    field: "createTime",
    headerName: "Create Time",
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
    width: 120,
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
export default categories;
