import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import TableSkeletion from "../../common/skeletion/TableSkeletion";
import { TimeFive } from "@styled-icons/boxicons-regular/TimeFive";
import { MoreHoriz } from "@styled-icons/material-outlined";
import { useNavigate } from "react-router-dom";

const CustomersOrder = ({ loading, data }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const getColor = (status) => {
    let color = theme.palette.text.primary;
    if (status === 0) {
      color = theme.palette.text.primary;
    } else if (status === 1) {
      color = theme.palette.text.pending;
    } else if (status === 2) {
      color = theme.palette.text.onStatus;
    } else if (status === 3) {
      color = theme.palette.text.active;
    } else if (status === 4) {
      color = theme.palette.text.checked;
    }

    return color;
  };

  const onNavigate = (id) => {
    navigate("/bookings/details", { state: { bookingId: id } });
  };
  return (
    <Box
      bgcolor={theme.palette.background.secondary}
      borderRadius={2.5}
      padding={2}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop={1}
        paddingX={1}
      >
        {loading ? (
          <Skeleton width={100} />
        ) : (
          <Typography fontWeight="semiBold" fontSize={20}>
            Customer Orders
          </Typography>
        )}

        {loading ? (
          <Skeleton width={50} />
        ) : (
          <Typography
            fontWeight="semiBold"
            fontSize={12}
            sx={{ cursor: "pointer" }}
            color={theme.palette.text.active}
            onClick={() => navigate("/bookings")}
          >
            Show More
          </Typography>
        )}
      </Box>

      <TableContainer sx={{ padding: 2 }}>
        <Table
          sx={{
            minWidth: 350,
            ".MuiTableCell-head": { color: theme.palette.text.third },
          }}
          aria-label="simple table"
        >
          <TableBody>
            {loading ? (
              <TableSkeletion rowsNum={4} columnsNum={3} />
            ) : (
              data.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Avatar src={item.customerImage} />
                      {item.customerName}
                    </TableCell>
                    <TableCell align="left" component="th" scope="row">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          width={10}
                          height={10}
                          borderRadius={10}
                          bgcolor={getColor(item.status)}
                        />
                        <Typography fontSize={14}>{item.statusType}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "inherit",
                            color: theme.palette.text.primary,
                            width: 30,
                          }}
                        >
                          <TimeFive width={14} />
                        </Avatar>
                        <Typography fontSize={14}>
                          {item.tourTotalTime
                            .toFixed(2)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                          h
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => onNavigate(item.id)}>
                        <MoreHoriz width={24} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomersOrder;
