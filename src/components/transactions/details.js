import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Skeleton,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

import Header from "../common/Header";

import { getTransactionDetails } from "./action";

import paypal from "../../assets/paypal.png";
import mastercard from "../../assets/mastercard.png";

const TransactionDetails = () => {
  const theme = useTheme();
  const { state } = useLocation();
  const { transactionId } = state;
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

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
        const data = await getTransactionDetails(transactionId);
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
  }, [transactionId]);

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
        title={"Transactions Details"}
        subTitle={"Show information about transactions of customers."}
        loading={loading}
        showBack={true}
      />

      <Box marginX={5} padding={4}>
        <Box
          padding={2}
          paddingLeft={5}
          bgcolor={alpha(theme.palette.background.secondary, 0.5)}
          borderRadius={5}
        >
          {loading ? (
            <Skeleton />
          ) : (
            <Grid container spacing={2}>
              <Grid item lg={3}>
                <Typography color={theme.palette.text.third}>
                  Transaction No
                </Typography>
                <Typography fontSize={14}>{values.id}</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography color={theme.palette.text.third}>
                  Customer ID
                </Typography>
                <Typography fontSize={14}>{values.id}</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography color={theme.palette.text.third}>
                  Booking ID
                </Typography>
                <Typography fontSize={14}>{values.bookingId}</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography color={theme.palette.text.third}>Amount</Typography>

                <Typography fontSize={14}>
                  {values.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography color={theme.palette.text.third}>
                  Currency
                </Typography>
                <Typography fontSize={14}>USD</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography color={theme.palette.text.third}>
                  Transaction Date
                </Typography>

                <Typography fontSize={14}>
                  {dayjs(values.createTime).format("lll")}
                </Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography color={theme.palette.text.third}>
                  Payment Method
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  {values.paymentMethod === "PayPal" ? (
                    <img src={paypal} width="20px" alt={values.paymentMethod} />
                  ) : (
                    <img
                      src={mastercard}
                      width="20px"
                      alt={values.paymentMethod}
                    />
                  )}
                  <Typography fontSize={14}>{values.paymentMethod}</Typography>
                </Box>
              </Grid>
              <Grid item lg={3}>
                <Typography color={theme.palette.text.third}>Status</Typography>
                <Typography
                  fontSize={14}
                  color={colorTransStatus(values.status)}
                >
                  {values.statusType}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TransactionDetails;
