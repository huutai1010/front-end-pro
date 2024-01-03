import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import TableSkeletion from "../../common/skeletion/TableSkeletion";
import { LinearProgressWithLabel } from "../../common/styled/LinearProgressWithLabel";

const NationalRank = ({ loading, data, total }) => {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.background.secondary}
      borderRadius={2.5}
      padding={2}
      height="100%"
    >
      <Box paddingX={1}>
        {loading ? (
          <Skeleton width={100} />
        ) : (
          <Typography fontWeight="medium">User Nationality Ranking</Typography>
        )}

        <Box padding={1} marginLeft={2}>
          {loading ? (
            <Skeleton width={100} />
          ) : (
            <Typography fontWeight="semiBold" variant="h4">
              {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
          )}
        </Box>
      </Box>

      <TableContainer>
        <Table
          sx={{
            ".MuiTableCell-head": { color: theme.palette.text.third },
            ".MuiTableCell-root": { padding: 1.25 },
          }}
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
                    <TableCell align="left">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box>
                          <Avatar
                            src={item.icon}
                            variant="circular"
                            sx={{ width: 30, height: 30 }}
                          />
                        </Box>
                        <Box width="100%">
                          <Typography fontSize={14}>
                            {item.nationalName}
                          </Typography>
                          <LinearProgressWithLabel value={item.ratio} />
                        </Box>
                      </Box>
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

export default NationalRank;
