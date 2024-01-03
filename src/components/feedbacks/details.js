import {
  Avatar,
  Box,
  Button,
  Grid,
  Skeleton,
  Typography,
  Rating,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

import Header from "../common/Header";

import { getFeedbackDetails } from "./action";
import { labels } from "../../constants/rating";
import { translate } from "../../api";

export const FeedbackDetails = () => {
  const theme = useTheme();
  const { state } = useLocation();
  const { feedbackId } = state;
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [translateText, setTranslateText] = useState("");
  const [errorText, setErrorText] = useState("");

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  useEffect(() => {
    async function getInfoDetails() {
      setLoading(true);
      try {
        const data = await getFeedbackDetails(feedbackId);
        setValues(data);
        setLoading(false);
      } catch (error) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Can't get data details for feedback!",
          status: "error",
        });
        setLoading(false);
      }
    }
    getInfoDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackId]);

  const getColor = (status) => {
    let color = theme.palette.text.active;
    if (status === 0) {
      color = theme.palette.text.active;
    } else if (status === 1) {
      color = theme.palette.text.onStatus;
    }

    return color;
  };

  const onTranslate = async (content) => {
    setErrorText("");
    try {
      const { translations } = await translate(content);
      setTranslateText(translations[0].translatedText);
    } catch (e) {
      setErrorText("Can't translate!");
      setTranslateText("");
    }
  };

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
        title={"Feedback Details"}
        subTitle={"Display feedback of customers."}
        loading={loading}
        showBack={true}
      />

      <Box marginX={5} padding={4}>
        <Grid container spacing={2}>
          <Grid item sm={12} lg={8}>
            {loading ? (
              <Skeleton variant="circle" height={100} width={100}>
                <Avatar />
              </Skeleton>
            ) : (
              <Box
                display="flex"
                borderRadius={2.5}
                border={1}
                borderColor={theme.palette.background.secondary}
              >
                <Box>
                  <img
                    src={values.itinerary?.image || values.place?.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box
                  padding={2}
                  minWidth={300}
                  display="flex"
                  flexDirection="column"
                  gap={0.5}
                  sx={{ borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                >
                  <Typography fontSize={18} fontWeight="medium">
                    {values.itinerary?.name || values.place?.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography color={theme.palette.text.third}>
                      {values.itinerary?.total.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      }) ||
                        values.place?.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                    </Typography>{" "}
                    <Rating
                      readOnly
                      size="small"
                      value={values.rate || 0}
                      precision={0.5}
                      sx={{
                        ".MuiRating-icon": {
                          borderColor: theme.palette.text.active,
                        },
                        "& .MuiRating-iconFilled": {
                          color: theme.palette.text.active,
                        },
                      }}
                    />
                    <Typography fontSize={12} color={theme.palette.text.third}>
                      ({labels[values.rate || 0]})
                    </Typography>
                  </Box>

                  <Typography color={theme.palette.text.third}>
                    {values.place?.address}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box
              marginTop={2}
              bgcolor={theme.palette.background.secondary}
              paddingY={3}
              paddingX={5}
              display="flex"
              flexDirection="column"
              rowGap={1}
              borderRadius={2.5}
            >
              {loading ? (
                <Skeleton width={200} />
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontSize={14} color={theme.palette.text.third}>
                      Create Time:
                    </Typography>

                    <Typography
                      marginLeft={1}
                      fontSize={14}
                      color={theme.palette.text.third}
                    >
                      {values.createTime
                        ? dayjs(values.createTime).format("lll")
                        : "no time"}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    paddingX={1}
                    paddingY={0.25}
                    bgcolor={alpha(getColor(values.status), 0.2)}
                    borderRadius={2.5}
                    width={80}
                  >
                    <Typography
                      fontWeight="medium"
                      fontSize={14}
                      textTransform="capitalize"
                      color={getColor(values.status)}
                    >
                      {values.status === 1 ? "Show" : "Hidden"}
                    </Typography>
                  </Box>
                </Box>
              )}
              {loading ? (
                <Skeleton width={200} />
              ) : (
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontSize={14} color={theme.palette.text.third}>
                    Rating:
                  </Typography>
                  <Rating
                    readOnly
                    size="small"
                    value={values.rate || 0}
                    precision={0.5}
                    sx={{
                      ".MuiRating-icon": {
                        borderColor: theme.palette.text.active,
                      },
                      "& .MuiRating-iconFilled": {
                        color: theme.palette.text.active,
                      },
                    }}
                  />
                  <Typography fontSize={12} color={theme.palette.text.third}>
                    ({labels[values.rate || 0]})
                  </Typography>
                </Box>
              )}

              {loading ? (
                <Skeleton width={200} />
              ) : (
                <Box display="flex" gap={1}>
                  <Box>
                    <Typography fontSize={14} color={theme.palette.text.third}>
                      Feedback:
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      marginLeft={1}
                      fontSize={14}
                      color={theme.palette.text.third}
                    >
                      {translateText === "" ? values.content : translateText}
                    </Typography>
                    {errorText}
                    {translateText === "" ? (
                      <Button
                        disableRipple
                        sx={{ "&:hover": { backgroundColor: "inherit" } }}
                        onClick={() => onTranslate(values.content)}
                      >
                        Translate
                      </Button>
                    ) : (
                      <Button
                        disableRipple
                        sx={{ "&:hover": { backgroundColor: "inherit" } }}
                        onClick={() => setTranslateText("")}
                      >
                        No Translate
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item sm={12} lg={4}>
            <Box
              padding={2}
              bgcolor={theme.palette.background.secondary}
              borderRadius={2.5}
              align="center"
            >
              {loading ? (
                <Skeleton variant="circle" height={100} width={100}>
                  <Avatar />
                </Skeleton>
              ) : (
                <Avatar
                  variant="circular"
                  src={values.account?.image || ""}
                  sx={{
                    width: 150,
                    height: 150,
                    border: 4,
                    borderColor: theme.palette.text.second,
                  }}
                />
              )}

              <Box marginTop={1}>
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  <Typography variant="h6">
                    {values.account?.customerName}{" "}
                    <small>({values.account?.gender})</small>
                  </Typography>
                )}
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  <Typography color={theme.palette.text.third} variant="body1">
                    {values.account?.phone || values.account?.email}
                  </Typography>
                )}
                {loading ? (
                  <Skeleton width={200} />
                ) : (
                  <Typography>
                    {values.account?.address},{values.account?.nationality}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
