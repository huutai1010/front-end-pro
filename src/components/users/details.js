import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

import { getUserDetails } from "./action";

import Header from "../common/Header";
import ErrorModal from "../common/ErrorModal";
import { ExpandMore } from "styled-icons/material";

const UserDetails = () => {
  const theme = useTheme();
  const { state } = useLocation();
  const { accountId } = state;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  useEffect(() => {
    async function getInfoDetails() {
      setLoading(true);
      try {
        setData(await getUserDetails(accountId));
        setLoading(false);
      } catch (err) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Can't loading data of this account!",
          status: "error",
        });
        setLoading(false);
      }
    }
    getInfoDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const colorStatus = (status) => {
    if (status === 0) {
      return theme.palette.text.active;
    } else if (status === 1) {
      return theme.palette.text.checked;
    } else if (status === 2) {
      return theme.palette.text.onStatus;
    }
  };

  console.log(colorStatus(0));

  return (
    <Box
      minWidth="94vh"
      margin="1.25em"
      padding={2}
      paddingBottom={5}
      bgcolor={theme.palette.background.primary}
      borderRadius={5}
    >
      <ErrorModal
        open={notification.errorState}
        setOpen={setNotification}
        message={notification.errorMessage}
        status={notification.status}
      />

      <Header
        title={"User Details"}
        subTitle={"Displays all customer information."}
        loading={loading}
        showBack={true}
      />

      <Box marginX={6} padding={3}>
        {/* ID and Status */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={1}
        >
          <Box display="inherit" alignItems="center" gap={1}>
            {loading ? (
              <Skeleton width={100} />
            ) : (
              <>
                <Typography color={theme.palette.text.third}>
                  Customer ID:
                </Typography>
                <Typography fontWeight="medium">#{data.id}</Typography>
              </>
            )}
          </Box>
          <Box display="inherit" alignItems="center" gap={1}>
            {loading ? (
              <Skeleton width={100} />
            ) : (
              <>
                <Typography color={theme.palette.text.third}>
                  Status:
                </Typography>
                {data.status ? (
                  <Box
                    bgcolor={alpha(theme.palette.text.onStatus, 0.1)}
                    paddingX={1}
                    borderRadius={20}
                    border={1}
                    borderColor={alpha(theme.palette.text.onStatus, 0.2)}
                  >
                    <Typography
                      fontWeight="semiBold"
                      color={theme.palette.text.onStatus}
                    >
                      Active
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    bgcolor={alpha(theme.palette.text.active, 0.1)}
                    paddingX={1}
                    borderRadius={20}
                    border={1}
                    borderColor={alpha(theme.palette.text.active, 0.2)}
                  >
                    <Typography
                      fontWeight="semiBold"
                      color={theme.palette.text.active}
                    >
                      Inactice
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* Information Details */}
        <Box
          bgcolor={theme.palette.background.secondary}
          padding={2}
          borderRadius={5}
        >
          {loading ? (
            <Skeleton width={100} />
          ) : (
            <Grid container spacing={7} padding={2}>
              <Grid item sm={12} md={4}>
                <Avatar
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 5,
                    bgcolor: theme.palette.background.primary,
                  }}
                  src={data.image}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box marginBottom={2.5}>
                  <Typography color={theme.palette.text.third}>
                    First Name
                  </Typography>
                  <Typography fontWeight="medium" noWrap>
                    {data.firstName}
                  </Typography>
                </Box>
                <Box marginBottom={2.5}>
                  <Typography color={theme.palette.text.third}>
                    Gender
                  </Typography>
                  <Typography fontWeight="medium" noWrap>
                    {data.gender}
                  </Typography>
                </Box>
                <Box marginBottom={2.5}>
                  <Typography color={theme.palette.text.third}>
                    Phone
                  </Typography>
                  <Typography fontWeight="medium" noWrap>
                    {data.phone}
                  </Typography>
                </Box>
                <Box marginBottom={2.5}>
                  <Typography color={theme.palette.text.third}>
                    Address
                  </Typography>
                  <Typography fontWeight="medium">{data.address}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box marginBottom={2.5}>
                  <Typography color={theme.palette.text.third}>
                    Last Name
                  </Typography>
                  <Typography fontWeight="medium" noWrap>
                    {data.lastName}
                  </Typography>
                </Box>
                <Box marginBottom={2.5}>
                  <Typography color={theme.palette.text.third}>
                    Nationality
                  </Typography>
                  <Typography fontWeight="medium" noWrap>
                    {data.nationality}
                  </Typography>
                </Box>
                <Box marginBottom={2.5}>
                  <Typography color={theme.palette.text.third}>
                    Email Address
                  </Typography>
                  <Typography fontWeight="medium" noWrap>
                    {data.email}
                  </Typography>
                </Box>
                <Box marginBottom={2.5}>
                  <Typography color={theme.palette.text.third}>
                    Create Time
                  </Typography>
                  <Typography fontWeight="medium" noWrap>
                    {dayjs(data.createTime).format("LL")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Transactions */}
        {loading ? (
          <Skeleton width={100} />
        ) : (
          <Accordion
            sx={{
              marginTop: 5,
              boxShadow: "none",
              "&:before": { height: 0 },
              border: 1,
              borderRadius: 5,
              borderColor: theme.palette.background.secondary,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore width={24} />}
              sx={{
                bgcolor: theme.palette.background.secondary,
                borderStartStartRadius: 2.5,
              }}
            >
              <Typography fontWeight="medium">Transactions History</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {data.transactionsHistory.length !== 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Payment Time</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.transactionsHistory.map((trans) => (
                        <TableRow
                          key={trans.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{trans.id}</TableCell>
                          <TableCell>
                            {trans.amount.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </TableCell>
                          <TableCell>{trans.paymentMethod}</TableCell>
                          <TableCell>
                            {dayjs(trans.createTime).format("LLL")}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ color: colorStatus(trans.status) }}
                          >
                            {trans.statusType}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box display="flex" justifyContent="center" padding={2}>
                  (No transaction)
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </Box>
  );
};

export default UserDetails;
