import { Box, Typography, alpha } from "@mui/material";
import { theme } from "../../styles/theme";
import dayjs from "dayjs";

const beacons = [
  {
    field: "name",
    headerName: "Position Name",
    sortable: false,
    flex: 1,
  },
  {
    field: "beaconId",
    headerName: "Beacon ID",
    sortable: false,
    flex: 1.5,
  },
  {
    field: "image",
    headerName: "Image",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
    sortable: false,
    renderCell: (params) => (
      <img
        src={params.row.image}
        alt={`${params.row.name}`}
        style={{
          width: 100,
          height: 70,
          border: `2px solid ${theme.palette.background.third}`,
        }}
      />
    ),
  },

  {
    field: "createTime",
    headerName: "Create Time",
    sortable: false,
    headerAlign: "right",
    align: "right",
    flex: 0.5,
    renderCell: (params) => dayjs(params.row.createTime).format("ll"),
  },
  {
    field: "status",
    headerName: "Status",
    sortable: false,
    headerAlign: "center",
    align: "center",
    flex: 0.5,
    renderCell: (params) => {
      const getColor = (status) => {
        let color = theme.palette.text.active;
        if (status === 0) {
          color = theme.palette.text.active;
        } else if (status === 1) {
          color = theme.palette.text.onStatus;
        }

        return color;
      };
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          paddingX={1}
          paddingY={0.25}
          bgcolor={alpha(getColor(params.row.status), 0.2)}
          borderRadius={2.5}
          width={80}
        >
          <Typography
            fontWeight="medium"
            fontSize={14}
            textTransform="capitalize"
            color={getColor(params.row.status)}
          >
            {params.row.status === 1 ? "Active" : "Deactive"}
          </Typography>
        </Box>
      );
    },
  },
];
export default beacons;
