import {
  alpha,
  Box,
  Grid,
  ImageList,
  ImageListItem,
  Rating,
  Tooltip,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import ReactMapGL, {
  Marker,
  Popup,
  GeolocateControl,
  ScaleControl,
  NavigationControl,
} from "@goongmaps/goong-map-react";

import { labels } from "../../../../constants/rating";
import date from "../../../../constants/date";
import { GOONG_MAPTILES_KEY } from "../../../../api";

import { StarFill } from "@styled-icons/bootstrap";
import PlaceInfo from "../../../common/PlaceInfo";

const geolocateStyle = {
  top: 0,
  left: 0,
  padding: "10px",
};

const navStyle = {
  top: 72,
  left: 0,
  padding: "10px",
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: "10px",
};

const GeneralInfo = ({ values, loading }) => {
  const theme = useTheme();
  const [popupInfo, setPopupInfo] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: values.latitude || 10.762622,
    longitude: values.longitude || 106.660172,
    zoom: 16,
  });

  useEffect(() => {
    setViewport({
      latitude: values?.latitude,
      longitude: values?.longitude,
      zoom: 14,
    });
  }, [values]);

  const data = () => {
    const newDateOfWeek = [];
    date.forEach((date) => {
      const value = values?.placeTimes?.find(
        (item) => item?.daysOfWeek === date?.id
      );

      newDateOfWeek.push({
        id: value?.id,
        day: date.day,
        openTime: "2022-04-17T" + value?.openTime,
        endTime: "2022-04-17T" + value?.endTime,
      });
    });

    return newDateOfWeek;
  };

  const color = (status) => {
    let color = theme.palette.text.active;
    if (status === 0) {
      color = theme.palette.text.active;
    } else if (status === 1) {
      color = theme.palette.text.pending;
    } else if (status === 2) {
      color = theme.palette.text.onStatus;
    }

    return color;
  };

  return (
    <Grid container spacing={5}>
      <Grid item md={12} lg={6}>
        <Box>
          {loading ? (
            <Skeleton width={150} />
          ) : (
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              General Information
            </Typography>
          )}

          <Box padding={2}>
            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={150}
                  color={theme.palette.text.third}
                >
                  Place Name{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
                <Typography>{values?.name}</Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={150}
                  color={theme.palette.text.third}
                >
                  Price{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
                <Typography>
                  $
                  {values?.price
                    ?.toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                </Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={150}
                  color={theme.palette.text.third}
                >
                  Entry Ticket
                </Typography>
                <Typography>
                  $
                  {values?.entryTicket
                    ?.toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                </Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={150}
                  color={theme.palette.text.third}
                >
                  Number of Positions
                </Typography>
                <Typography>{values?.placeItems?.length}</Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={150}
                  color={theme.palette.text.third}
                >
                  Duration{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
                <Typography>{values?.hour}</Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={150}
                  color={theme.palette.text.third}
                >
                  Category{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                >
                  {values?.placeCategories?.map((item, index) => (
                    <Box
                      key={index}
                      bgcolor={theme.palette.background.hovered}
                      paddingX={1}
                      paddingY={0.25}
                      borderRadius={2.5}
                    >
                      <Typography
                        fontSize={12}
                        color={theme.palette.text.second}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" marginBottom={1.5}>
                <Box minWidth={150}>
                  <Typography
                    fontSize={14}
                    fontWeight="medium"
                    width={150}
                    color={theme.palette.text.third}
                  >
                    Address{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                </Box>
                <Typography>{values?.address}</Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={150}
                  color={theme.palette.text.third}
                >
                  Longitude{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
                <Typography>{values?.longitude}</Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={150}
                  color={theme.palette.text.third}
                >
                  Latitude{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
                <Typography>{values?.latitude}</Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={150}
                  color={theme.palette.text.third}
                >
                  Google Place ID
                </Typography>
                <Typography>
                  {values?.googlePlaceId ? values?.googlePlaceId : "(No data)"}
                </Typography>
              </Box>
            )}
          </Box>

          <Box marginTop={3}>
            {loading ? (
              <Skeleton width={150} />
            ) : (
              <Typography
                fontSize={14}
                letterSpacing={0.5}
                fontWeight="medium"
                textTransform="uppercase"
                color={theme.palette.text.third}
              >
                Other Information
              </Typography>
            )}
          </Box>

          <Box padding={2}>
            <Grid container spacing={1}>
              <Grid item xs={6} display="flex" alignItems="center">
                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <>
                    <Typography
                      width={100}
                      fontSize={14}
                      fontWeight="medium"
                      color={theme.palette.text.third}
                    >
                      Status:
                    </Typography>
                    <Box
                      paddingX={1}
                      bgcolor={alpha(color(values?.status), 0.2)}
                      borderRadius={2.5}
                    >
                      <Typography
                        fontWeight="medium"
                        fontSize={14}
                        textTransform="capitalize"
                        color={color(values?.status)}
                      >
                        {values?.statusType}
                      </Typography>
                    </Box>
                  </>
                )}
              </Grid>

              <Grid item xs={6} display="flex" alignItems="center">
                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <>
                    <Typography
                      width={100}
                      fontSize={14}
                      fontWeight="medium"
                      color={theme.palette.text.third}
                    >
                      Rating:
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Rating
                        readOnly
                        size="small"
                        value={values?.rate || 0}
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
                      <Typography marginLeft={1} fontSize={14}>
                        ({labels[values?.rate || 0]})
                      </Typography>
                    </Box>
                  </>
                )}
              </Grid>

              <Grid item xs={6} display="flex">
                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <>
                    <Typography
                      width={120}
                      fontSize={14}
                      fontWeight="medium"
                      color={theme.palette.text.third}
                    >
                      Create Time:
                    </Typography>
                    <Box>
                      <Typography fontSize={14}>
                        {dayjs(values?.createTime).format("MMMM DD, YYYY")}
                      </Typography>
                    </Box>{" "}
                  </>
                )}
              </Grid>

              <Grid item xs={6} display="flex">
                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <>
                    <Typography
                      width={120}
                      fontSize={14}
                      fontWeight="medium"
                      color={theme.palette.text.third}
                    >
                      Update Time:
                    </Typography>
                    <Box>
                      <Typography fontSize={14}>
                        {dayjs(values?.updateTime).isValid()
                          ? dayjs(values?.updateTime).format("MMMM DD, YYYY")
                          : "(No update)"}
                      </Typography>
                    </Box>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box marginTop={3}>
            {loading ? (
              <Skeleton width={150} />
            ) : (
              <Typography
                fontSize={14}
                letterSpacing={0.5}
                fontWeight="medium"
                textTransform="uppercase"
                color={theme.palette.text.third}
              >
                Days Of Week
              </Typography>
            )}
          </Box>

          <Box padding={2}>
            {loading ? (
              <Skeleton width="100%" />
            ) : (
              data().map((data, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  marginBottom={1}
                >
                  <Typography
                    width={150}
                    fontSize={14}
                    fontWeight="medium"
                    color={theme.palette.text.third}
                  >
                    {data.day}
                  </Typography>

                  <Typography>{dayjs(data.openTime).format("LT")}</Typography>
                  <Typography>~</Typography>
                  <Typography>{dayjs(data.endTime).format("LT")}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Grid>

      <Grid item md={12} lg={6}>
        <Box>
          {loading ? (
            <Skeleton width={150} />
          ) : (
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              Place in Map
            </Typography>
          )}
          <Box padding={2}>
            {loading ? (
              <Skeleton variant="rounded" width="100%" height={400} />
            ) : (
              <Box
                border={1}
                borderColor={theme.palette.background.third}
                borderRadius={2.5}
                padding={1}
                height={400}
              >
                <ReactMapGL
                  {...viewport}
                  width="100%"
                  height="100%"
                  borderRadius={5}
                  onViewportChange={setViewport}
                  goongApiAccessToken={GOONG_MAPTILES_KEY}
                >
                  <Marker
                    longitude={values?.longitude}
                    latitude={values?.latitude}
                  >
                    <svg
                      height={20}
                      viewBox="0 0 24 24"
                      style={{
                        cursor: "pointer",
                        fill: "#d00",
                        stroke: "none",
                        transform: `translate(${-20 / 2}px,${-20}px)`,
                      }}
                      onClick={() => setPopupInfo(values)}
                    >
                      <path
                        d={`M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`}
                      />
                    </svg>
                  </Marker>

                  {popupInfo && (
                    <Popup
                      tipSize={5}
                      anchor="top"
                      longitude={popupInfo?.longitude}
                      latitude={popupInfo?.latitude}
                      closeOnClick={false}
                      onClose={setPopupInfo}
                    >
                      <PlaceInfo info={popupInfo} />
                    </Popup>
                  )}
                  <GeolocateControl style={geolocateStyle} />
                  <NavigationControl style={navStyle} />
                  <ScaleControl style={scaleControlStyle} />
                </ReactMapGL>
              </Box>
            )}
          </Box>
        </Box>

        <Box>
          {loading ? (
            <Skeleton width={150} />
          ) : (
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              Images List
            </Typography>
          )}

          <Box padding={2}>
            {loading ? (
              <Skeleton width="100%" height={400} variant="rounded" />
            ) : (
              <ImageList cols={2} gap={2} sx={{ maxHeight: 400 }}>
                {values?.placeImages?.map((item, index) => (
                  <ImageListItem key={index}>
                    {item.isPrimary ? (
                      <Tooltip title={"Primary Image"}>
                        <Box
                          style={{
                            position: "absolute",
                            width: 25,
                            height: 25,
                            borderRadius: "10px 0 5px 0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            left: 0,
                            top: 0,
                            backgroundColor: theme.palette.background.secondary,
                            color: theme.palette.text.pending,
                          }}
                        >
                          <StarFill width={18} />
                        </Box>
                      </Tooltip>
                    ) : null}
                    <img
                      src={item.image}
                      alt={item.id}
                      loading="lazy"
                      style={{
                        borderRadius: 10,
                        maxWidth: 300,
                        maxHeight: 300,
                        border: `1px solid ${theme.palette.background.third}`,
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default GeneralInfo;
