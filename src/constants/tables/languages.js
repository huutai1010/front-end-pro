import { Box, Typography, alpha } from "@mui/material";
import { theme } from "../../styles/theme";
import moment from "moment/moment";

const languages = [
  {
    field: "id",
    headerName: "Language ID",
    headerAlign: "center",
    width: 120,
    align: "center",
  },
  {
    field: "icon",
    headerName: "National Flag",
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: (params) => (
      <img
        src={params.row.icon}
        alt={`${params.row.name}`}
        style={{
          width: 100,
          height: 60,
          border: `2px solid ${theme.palette.background.third}`,
        }}
      />
    ),
  },
  {
    field: "languageCode",
    headerName: "Language Code",
    flex: 1,
  },
  {
    field: "name",
    headerName: "Language Name",
    flex: 1,
  },
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
    width: 120,
    renderCell: (params) => {
      if (params.row.status === 0) {
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
      } else if (params.row.status === 1) {
        return (
          <Box
            border={1}
            borderRadius={20}
            width={80}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderColor={alpha(theme.palette.text.pending, 0.1)}
            bgcolor={alpha(theme.palette.text.pending, 0.1)}
          >
            <Typography
              variant="span"
              fontWeight="medium"
              color={theme.palette.text.pending}
            >
              Preparing
            </Typography>
          </Box>
        );
      } else if (params.row.status === 2) {
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
      }
    },
  },
];
export default languages;
