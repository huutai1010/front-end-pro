import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  useTheme,
  alpha,
  Avatar,
  Typography,
  Grid,
  Skeleton,
} from "@mui/material";

import CardTotal from "././others/CardTotal";
import PlaceRank from "./others/PlaceRank";
import NationalRank from "./others/NationalRank";
import PieLanguage from "./others/PieLanguage";
import ChartRevenue from "./others/ChartRevenue";
import { StyledBadge } from "../common/styled/StyledBadge";

import {
  getLanguagesData,
  getNationalRank,
  // getOrdersData,
  getReveneData,
  getTopPlace,
  getTotalData,
  getTotalDataAdmin,
  getUserData,
} from "./action";

import ChartUserAnalysis from "./others/ChartUserAnalysis";
import { DateRangePicker } from "rsuite";
import dayjs from "dayjs";

const HomePage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.profile);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [getDataByDate, setGetDataByDate] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [time, setTime] = useState([]);

  const [option, setOption] = useState(7);
  const [optionUser, setOptionUser] = useState(3);
  const [total, setTotal] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [language, setLanguage] = useState([]);
  const [topPlace, setTopPlace] = useState([]);

  const [totalAd, setTotalAd] = useState([]);
  const [user, setUser] = useState([]);
  const [nationalAd, setNationalAd] = useState([]);

  const { afterToday } = DateRangePicker;

  useEffect(() => {
    let startTime = "",
      endTime = "";
    if (time !== null && time.length !== 0) {
      startTime = dayjs(time[0]).format("L");
      endTime = dayjs(time[1]).format("L");
    }

    async function fetchData() {
      if (profile.roleId === 2 || profile.roleName === "Moderator") {
        if (getDataByDate) {
          setLoadingData(true);
        }

        try {
          const totalData = await dispatch(
            getTotalData({ startTime: startTime, endTime: endTime })
          );
          setTotal(totalData.chart);
          const languageData = await dispatch(getLanguagesData());
          setLanguage(languageData.statictical);
          // const orderData = await dispatch(getOrdersData());
          // setOrder(orderData.staticticalOrder);
          const topData = await dispatch(
            getTopPlace({ startTime: startTime, endTime: endTime })
          );
          setTopPlace(topData.charts);
          setLoadingData(false);
          setLoading(false);
        } catch (error) {
          setLoadingData(false);
          setLoading(false);
        }

        try {
          const revenueData = await dispatch(
            getReveneData({
              options: option,
              startTime: startTime,
              endTime: endTime,
            })
          );
          setRevenue(revenueData);
          setLoadingSelect(false);
        } catch (error) {
          setLoadingSelect(false);
        }

        try {
          const userData = await dispatch(
            getUserData({
              options: optionUser,
              startTime: startTime,
              endTime: endTime,
            })
          );
          setUser(userData);
          setLoadingSelect(false);
        } catch (error) {
          setLoadingSelect(false);
        }
      } else {
        if (getDataByDate) {
          setLoadingData(true);
        }
        try {
          const totalDataAdmin = await dispatch(
            getTotalDataAdmin({ startTime: startTime, endTime: endTime })
          );
          setTotalAd(totalDataAdmin.chart);
          const nationalData = await dispatch(getNationalRank());
          setNationalAd(nationalData);
          setLoading(false);
          setLoadingData(false);
        } catch (error) {
          setLoadingData(false);
          setLoading(false);
        }

        try {
          const userData = await dispatch(
            getUserData({
              options: optionUser,
              startTime: startTime,
              endTime: endTime,
            })
          );
          setUser(userData);
          setLoadingSelect(false);
        } catch (error) {
          setLoadingSelect(false);
        }
      }
    }

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option, optionUser, time]);

  return (
    <Box
      minHeight="94vh"
      margin="1.25em"
      padding={2}
      bgcolor={theme.palette.background.primary}
      borderRadius={5}
    >
      {/* Header HomePage */}
      <Box marginX={2}>
        <Grid container spacing={2.5}>
          <Grid item sm={12} lg={9} xl={9.5}>
            <Box minHeight={100} marginRight={2.5}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {loading ? (
                  <Skeleton width={300} />
                ) : (
                  <Typography variant="h5" fontWeight="semiBold">
                    {`Hello, ${profile.firstName + " " + profile.lastName}`}
                  </Typography>
                )}
                <Box display="flex" alignItems="center" gap={2}>
                  {loading ? (
                    <Skeleton width={200} />
                  ) : (
                    <DateRangePicker
                      value={time}
                      showOneCalendar
                      disabledDate={afterToday()}
                      onClean={() => setGetDataByDate(false)}
                      onChange={(newValue) => {
                        setGetDataByDate(true);
                        setTime(newValue);
                      }}
                      placeholder="Show Data By Date Range"
                    />
                  )}
                </Box>
              </Box>
              {loading ? (
                <Skeleton width={200} />
              ) : (
                <Typography color={theme.palette.text.third}>
                  Try your best every day!!
                </Typography>
              )}
            </Box>

            <CardTotal
              loading={loading}
              loadingData={loadingData}
              admin={
                profile.roleId === 2 || profile.roleName === "Moderator"
                  ? false
                  : true
              }
              data={
                profile.roleId === 2 || profile.roleName === "Moderator"
                  ? total
                  : totalAd
              }
            />
          </Grid>

          <Grid
            item
            sx={{ display: { sm: "none", lg: "flex" } }}
            justifyContent="center"
            lg={3}
            xl={2.5}
          >
            {loading ? (
              <Skeleton variant="rounded" width={222} height={222}>
                <Avatar />
              </Skeleton>
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                width="100%"
                minWidth={222}
                minHeight={222}
                bgcolor={alpha(theme.palette.background.hovered, 0.1)}
                borderRadius={2.5}
                gap={2}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    alt={profile.firstName + " " + profile.lastName}
                    src={profile.image}
                    sx={{
                      width: 111,
                      height: 111,
                      border: 2,
                      borderColor: theme.palette.background.secondary,
                    }}
                  />
                </StyledBadge>

                <Box alignItems="center" flexDirection="column" display="flex">
                  <Typography fontWeight="medium" noWrap>
                    {profile.firstName + " " + profile.lastName}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight="light"
                    color={theme.palette.text.third}
                  >
                    #
                    {(
                      profile.id +
                      "" +
                      profile.roleId +
                      "" +
                      profile.languageCode
                    ).toUpperCase()}
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <Box marginX={2}>
        <Grid container paddingTop={3} spacing={2.5}>
          <Grid item sm={12} lg={8}>
            {profile.roleId === 2 || profile.roleName === "Moderator" ? (
              <ChartRevenue
                loading={loading}
                loadingData={loadingData}
                loadingSelect={loadingSelect}
                time={time}
                data={revenue.charts}
                option={option}
                total={revenue.totalRevenue}
                setLoadingSelect={setLoadingSelect}
                setOption={setOption}
              />
            ) : (
              <ChartUserAnalysis
                loading={loading}
                loadingData={loadingData}
                loadingSelect={loadingSelect}
                time={time}
                data={user.charts}
                option={optionUser}
                setLoadingSelect={setLoadingSelect}
                setOption={setOptionUser}
              />
            )}
          </Grid>
          <Grid item sm={12} lg={4}>
            {profile.roleId === 2 || profile.roleName === "Moderator" ? (
              <PlaceRank
                loading={loading}
                loadingData={loadingData}
                data={topPlace}
              />
            ) : (
              <NationalRank
                loading={loading}
                loadingData={loadingData}
                data={nationalAd.statictical}
                total={nationalAd.total}
              />
            )}
          </Grid>
          <Grid item sm={12} lg={6}>
            {(profile.roleId === 2 || profile.roleName === "Moderator") && (
              <PieLanguage
                loading={loading}
                loadingData={loadingData}
                data={language}
              />
            )}
          </Grid>
          <Grid item sm={12} lg={6}>
            {(profile.roleId === 2 || profile.roleName === "Moderator") && (
              <ChartUserAnalysis
                loading={loading}
                loadingData={loadingData}
                loadingSelect={loadingSelect}
                time={time}
                data={user.charts}
                option={optionUser}
                setLoadingSelect={setLoadingSelect}
                setOption={setOptionUser}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
