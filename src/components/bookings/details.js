import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { Box } from "@mui/system";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

import Header from "../common/Header";

import { getBookingDetails } from "./action";

import paypal from "../../assets/paypal.png";
import mastercard from "../../assets/mastercard.png";

import { ExpandMore } from "styled-icons/material";

const BookingDetails = () => {
  const theme = useTheme();
  const { state } = useLocation();
  const { bookingId } = state;
  const [values, setValues] = useState({});

  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const colorStatus = (state) => {
    let color = theme.palette.text.primary;
    if (state === 0) {
      color = theme.palette.text.primary;
    } else if (state === 1) {
      color = theme.palette.text.onStatus;
    } else if (state === 2) {
      color = theme.palette.text.checked;
    } else if (state === 3) {
      color = theme.palette.text.pending;
    } else if (state === 4) {
      color = theme.palette.text.onStatus;
    } else if (state === 5) {
      color = theme.palette.text.active;
    }

    return color;
  };

  const colorTransStatus = (state) => {
    let color = theme.palette.text.active;
    if (state === 0) {
      color = theme.palette.text.active;
    } else if (state === 1) {
      color = theme.palette.text.checked;
    } else if (state === 2) {
      color = theme.palette.text.onStatus;
    }

    return color;
  };
  useEffect(() => {
    async function getInfoDetails() {
      setLoading(true);
      try {
        const data = await getBookingDetails(bookingId);
        setValues(data);
        setLoading(false);
      } catch (error) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Can't get data details for booking!",
          status: "error",
        });
        setLoading(false);
      }
    }
    getInfoDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  return (
    <Box
      minHeight="94vh"
      margin="1.25em"
      padding={2}
      bgcolor={theme.palette.background.primary}
      borderRadius={5}
    >
      {/* Title */}
      <Header
        title={"Booking Details"}
        subTitle={"Show information about booking of customers."}
        loading={loading}
        showBack={true}
      />

      <Box marginX={6} padding={3}>
        <Grid container spacing={8}>
          <Grid item md={12} lg={7}>
            <Box>
              {loading ? (
                <Skeleton width={100} />
              ) : (
                <Typography
                  fontSize={14}
                  letterSpacing={0.5}
                  fontWeight="medium"
                  textTransform="uppercase"
                  color={theme.palette.text.third}
                >
                  Information Customer
                </Typography>
              )}
            </Box>

            <Box padding={2}>
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <Box display="flex" marginY={0.5} gap={1}>
                  <Box>
                    <Typography width={150} color={theme.palette.text.third}>
                      Customer Name:
                    </Typography>
                  </Box>
                  <Typography noWrap>
                    {values?.customerInfor?.customerName}
                  </Typography>
                </Box>
              )}

              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <Box display="flex" marginY={0.5} gap={1}>
                  <Box>
                    <Typography width={150} color={theme.palette.text.third}>
                      Gender:
                    </Typography>
                  </Box>
                  <Typography noWrap>
                    {values?.customerInfor?.gender}
                  </Typography>
                </Box>
              )}

              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <Box display="flex" marginY={0.5} gap={1}>
                  <Typography width={150} color={theme.palette.text.third}>
                    Nationality:
                  </Typography>
                  <Typography noWrap>
                    {values?.customerInfor?.nationality}
                  </Typography>
                </Box>
              )}
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <Box display="flex" marginY={0.5} gap={1}>
                  <Typography width={150} color={theme.palette.text.third}>
                    Phone Number:
                  </Typography>
                  <Typography noWrap>{values?.customerInfor?.phone}</Typography>
                </Box>
              )}
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <Box display="flex" marginY={0.5} gap={1}>
                  <Typography width={150} color={theme.palette.text.third}>
                    Email Address:
                  </Typography>
                  <Typography noWrap>{values?.customerInfor?.email}</Typography>
                </Box>
              )}
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <Box display="flex" marginY={0.5} gap={1}>
                  <Typography width={150} color={theme.palette.text.third}>
                    Address:
                  </Typography>
                  <Typography noWrap>
                    {values?.customerInfor?.address}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box>
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <Accordion
                  sx={{
                    marginTop: 1,
                    boxShadow: " rgba(0, 0, 0, 0.04) 0px 3px 5px;",
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore width={24} />}>
                    <Typography>Place Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {values?.placeDetail?.map((place) => (
                      <Box
                        key={place.name}
                        borderBottom={1}
                        borderColor={theme.palette.background.third}
                        marginTop={2}
                      >
                        <Typography>{place.name}</Typography>
                        <Grid
                          container
                          color={theme.palette.text.third}
                          padding={1}
                        >
                          <Grid item xs={4} textAlign="left">
                            <Typography fontSize={14} noWrap>
                              Price
                            </Typography>
                            <Typography fontSize={14} noWrap>
                              $ {place.price}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="center">
                            <Typography fontSize={14} noWrap>
                              Duration
                            </Typography>
                            <Typography fontSize={14} noWrap>
                              {place.hour}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            <Typography fontSize={14} noWrap>
                              Category
                            </Typography>
                            <Typography fontSize={14} noWrap>
                              {place.categoryName}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          </Grid>

          <Grid item md={12} lg={5}>
            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box
                bgcolor={alpha(theme.palette.background.third, 0.2)}
                padding={3}
                borderRadius={2.5}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    fontSize={20}
                    letterSpacing={0.5}
                    fontWeight="medium"
                    textTransform="uppercase"
                    color={theme.palette.text.third}
                  >
                    Booking Bill
                  </Typography>
                  <Box
                    border={1}
                    borderRadius={20}
                    paddingX={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderColor={alpha(colorStatus(values.status), 0.1)}
                    bgcolor={alpha(colorStatus(values.status), 0.1)}
                  >
                    <Typography
                      variant="span"
                      fontWeight="medium"
                      color={colorStatus(values.status)}
                      textTransform="capitalize"
                    >
                      {values.statusType}
                    </Typography>
                  </Box>
                </Box>

                <Box paddingY={0.5} paddingX={1.5}>
                  <Box marginBottom={1}>
                    <Typography textTransform="capitalize">
                      Booking Number
                    </Typography>
                    <Typography
                      textTransform="capitalize"
                      color={alpha(theme.palette.text.third, 0.6)}
                    >
                      {values.id}
                    </Typography>
                  </Box>
                  <Box marginBottom={1}>
                    <Typography textTransform="capitalize">
                      Booking Date
                    </Typography>
                    <Typography
                      textTransform="capitalize"
                      color={alpha(theme.palette.text.third, 0.6)}
                    >
                      {dayjs(values.createTime).format("LLL")}
                    </Typography>
                  </Box>

                  <Box marginBottom={1}>
                    <Typography textTransform="capitalize">
                      duration Expected
                    </Typography>
                    <Typography
                      textTransform="capitalize"
                      color={alpha(theme.palette.text.third, 0.6)}
                    >
                      {values.durationExpected}
                    </Typography>
                  </Box>
                  <Box marginBottom={1}>
                    <Typography textTransform="capitalize">
                      Number of Places
                    </Typography>
                    <Typography
                      textTransform="capitalize"
                      color={alpha(theme.palette.text.third, 0.6)}
                    >
                      {values.placeDetail.length}
                    </Typography>
                  </Box>
                  <Box marginBottom={1}>
                    <Typography textTransform="capitalize">
                      Total Prices
                    </Typography>
                    <Typography
                      textTransform="capitalize"
                      color={alpha(theme.palette.text.third, 0.6)}
                    >
                      {values.total.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>

        <Box marginTop={4}>
          <Box>
            {loading ? (
              <Skeleton width={100} />
            ) : (
              <Typography
                fontSize={14}
                letterSpacing={0.5}
                fontWeight="medium"
                textTransform="uppercase"
                color={theme.palette.text.third}
              >
                Transaction List
              </Typography>
            )}
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">Payment Time</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values?.historyTransactions &&
                  values?.historyTransactions?.map((trans) => (
                    <TableRow
                      key={trans.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {trans.id}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {trans.paymentMethod === "PayPal" ? (
                            <img
                              src={paypal}
                              width="20px"
                              alt={trans.paymentMethod}
                            />
                          ) : (
                            <img
                              src={mastercard}
                              width="20px"
                              alt={trans.paymentMethod}
                            />
                          )}
                          {trans.paymentMethod}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {trans.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {dayjs(trans.createTime).format("lll")}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="span"
                          fontWeight="medium"
                          color={colorTransStatus(trans.status)}
                          textTransform="capitalize"
                        >
                          {trans.statusType}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingDetails;
