import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, TextField, Typography, useTheme } from "@mui/material";

import date from "../../../constants/date";
import { NumberFormat } from "../../common/NumberFormat";
import ReactMapGL from "@goongmaps/goong-map-react";
import GoongGeocoder from "@goongmaps/goong-geocoder";
// import PlaceAutoComplete from "./PlaceAutoComplete";
import goongJs from "@goongmaps/goong-js";
import { GOONG_API_KEY, GOONG_MAPTILES_KEY } from "../../../api";

const Coordinates = ({ values, setValues, setValue, errors, register }) => {
  const theme = useTheme();
  const [daysOfWeek, setDaysOfWeek] = useState(date);
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState({
    latitude: 10.762622,
    longitude: 106.660172,
    zoom: 11,
    bearing: 0,
    pitch: 0,
  });

  useEffect(() => {
    const geocoder = new GoongGeocoder({
      accessToken: GOONG_API_KEY,
      goongjs: goongJs,
    });

    if (mapRef.current && geocoder) {
      const map = mapRef.current.getMap();
      map.addControl(geocoder);

      geocoder.on("result", function (e) {
        setViewport({
          ...viewport,
          latitude: e.result.result.geometry.location.lat,
          longitude: e.result.result.geometry.location.lng,
        });
        setValues({
          ...values,
          address: e.result.result.formatted_address,
          latitude: e.result.result.geometry.location.lat,
          longitude: e.result.result.geometry.location.lng,
        });

        setValue("address", e.result.result.formatted_address);
        setValue("latitude", e.result.result.geometry.location.lat);
        setValue("longitude", e.result.result.geometry.location.lng);
      });
    }

    // return () => {
    //   geocoder.onRemove();
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTime = (index, event) => {
    const dataTime = [...values.placeTimes];
    dataTime[index][event.target.name] = event.target.value;
    setDaysOfWeek(dataTime);
    setValues({ ...values, placeTimes: dataTime });
  };

  return (
    <Box paddingX={4} width="100%" marginTop={3}>
      <Grid container marginBottom={3} spacing={3}>
        <Grid item xs={12} lg={6}>
          <Box
            padding={2}
            minHeight={500}
            borderRadius={2.5}
            bgcolor={theme.palette.background.secondary}
            width="100%"
          >
            <ReactMapGL
              {...viewport}
              width="100%"
              height="70vh"
              onViewportChange={setViewport}
              goongApiAccessToken={GOONG_MAPTILES_KEY}
              ref={mapRef}
            />
          </Box>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Box>
            <Typography
              fontSize={14}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              Location
            </Typography>
            <Grid container rowGap={1.5} paddingX={1} marginTop={2}>
              {/* Place Address */}
              <Grid item xs={12} md={4}>
                <Typography color={theme.palette.text.third}>
                  Place Address{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  value={values.address}
                  {...register("address", {
                    required: "Address is required!",
                    onChange: (e) =>
                      setValues({ ...values, address: e.target.value }),
                  })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  placeholder={`Type place address here`}
                />
              </Grid>
              {/* Latitude */}
              <Grid item xs={12} md={4}>
                <Typography color={theme.palette.text.third}>
                  Latitude{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  size="small"
                  value={values.latitude}
                  {...register("latitude", {
                    required: "Latitude is required!",
                    defaultValue: 0,
                    onChange: (e) => {
                      setValues({
                        ...values,
                        latitude: Number(e.target.value),
                      });
                    },
                  })}
                  error={!!errors.latitude}
                  helperText={errors.latitude?.message}
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                    inputComponent: NumberFormat,
                  }}
                  placeholder={`Type latitude here`}
                />
              </Grid>

              {/* Longitude */}
              <Grid item xs={12} md={4}>
                <Typography color={theme.palette.text.third}>
                  Longitude{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  size="small"
                  value={values.longitude}
                  {...register("longitude", {
                    required: "Longitude is required!",
                    defaultValue: 0,
                    onChange: (e) => {
                      setValues({
                        ...values,
                        longitude: Number(e.target.value),
                      });
                    },
                  })}
                  error={!!errors.longitude}
                  helperText={errors.longitude?.message}
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                    inputComponent: NumberFormat,
                  }}
                  placeholder={`Type longitude here`}
                />
              </Grid>

              {/* GooglePlaceID */}
              <Grid item xs={12} md={4}>
                <Typography color={theme.palette.text.third}>
                  GooglePlaceID
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  size="small"
                  value={values.googlePlaceId}
                  onChange={(e) =>
                    setValues({ ...values, googlePlaceId: e.target.value })
                  }
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  placeholder={`Type google place ID here`}
                />
              </Grid>
            </Grid>
          </Box>
          <Box marginTop={3}>
            <Typography
              fontSize={14}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              Date Of Week
            </Typography>

            {daysOfWeek.map((data, index) => (
              <Grid
                key={index}
                container
                paddingX={1}
                marginTop={1}
                spacing={1}
              >
                <Grid item xs={12} lg={4}>
                  <Typography width={100} color={theme.palette.text.third}>
                    {data.day}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    type="time"
                    name="openTime"
                    value={data.openTime}
                    onChange={(event) => handleChangeTime(index, event)}
                    InputProps={{
                      style: {
                        borderRadius: 10,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    type="time"
                    name="endTime"
                    value={data.endTime}
                    onChange={(event) => handleChangeTime(index, event)}
                    InputProps={{
                      style: {
                        borderRadius: 10,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Coordinates;
