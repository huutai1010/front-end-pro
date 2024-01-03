import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { imageFileTypes } from "../../../../constants/fileType";

import { updatePlace } from "../../action";

import { CloseOutline } from "@styled-icons/evaicons-outline";
import { NumericFormatCustom } from "../../../common/NumericFormatCustom";
import dayjs from "dayjs";
import MapCoordinates from "./MapCoordinates";
import { StarFill } from "@styled-icons/bootstrap";
import { NumberFormat } from "../../../common/NumberFormat";
import date from "../../../../constants/date";

const DialogUpdate = ({
  dialog,
  setDialog,
  setValues,
  data,
  setData,
  categories,
  control,
  register,
  handleSubmit,
  errors,
  getValues,
  update,
  setUpdate,
  notification,
  setNotification,
}) => {
  const theme = useTheme();

  const dateOfWeek = () => {
    const newDateOfWeek = [];
    date.forEach((date) => {
      const value = data?.placeTimes?.find(
        (item) => item?.daysOfWeek === date?.id
      );

      newDateOfWeek.push({
        id: value?.id,
        day: date.day,
        openTime: value?.openTime,
        endTime: value?.endTime,
      });
    });

    return newDateOfWeek;
  };

  const previewImage = (image) => {
    if (image instanceof File && imageFileTypes.includes(image.type)) {
      return URL.createObjectURL(image);
    }
    return image;
  };

  const removeImage = (index) => {
    const newImagesList = [...data?.placeImages];
    newImagesList.splice(index, 1);

    setData({ ...data, placeImages: newImagesList });
  };

  const changePrimaryImage = (index) => {
    const newImagesList = [...data?.placeImages];
    newImagesList.forEach((image) => {
      image.isPrimary = false;
    });

    newImagesList[index].isPrimary = true;

    setData({ ...data, placeImages: newImagesList });
  };

  const handleChangeImages = (event) => {
    const selectedImageFiles = Array.from(event.target.files);
    const newImagesList = selectedImageFiles.map((file) => {
      return { image: file, isPrimary: false };
    });
    setData({
      ...data,
      placeImages: data.placeImages.concat(newImagesList),
    });
  };

  const handleChangeTime = (index, event) => {
    const dataTime = [...data?.placeTimes];
    dataTime[index][event.target.name] = event.target.value;
    setData({ ...data, placeTimes: dataTime });
  };

  const onUpdate = async () => {
    let dataUpdate = {
      name: data.name,
      longitude: data.longitude,
      latitude: data.latitude,
      address: data.address,
      hour: dayjs(data.hour).isValid()
        ? dayjs(data.hour).format("HH:mm:ss")
        : data.hour,
      googlePlaceId: data.googlePlaceId,
      price: data.price,
      entryTicket: data.entryTicket,
      placeCategories: [],
      placeImages: data.placeImages,
      placeDescriptions: [],
      placeTimes: [],
      placeItems: [],
    };
    for (const cate of getValues("placeCategories")) {
      dataUpdate.placeCategories.push({ id: cate.id });
    }

    for (const desc of getValues("placeDescriptions")) {
      dataUpdate.placeDescriptions.push({
        languageCode: desc.languageCode,
        voiceFile: desc.voiceFile,
        name: desc.name,
        description: desc.description,
        status: desc.status,
      });
    }

    for (const time of data.placeTimes) {
      dataUpdate.placeTimes.push({
        daysOfWeek: time.daysOfWeek,
        openTime: time.openTime,
        endTime: time.endTime,
      });
    }

    for (const item of getValues("placeItems")) {
      dataUpdate.placeItems.push({
        name: item.name,
        beaconId: item.beaconId,
        image: item.image,
        startTime: item.startTime,
        endTime: item.endTime,
        beaconMajorNumber: item.beaconMajorNumber,
        beaconMinorNumber: item.beaconMinorNumber,
        itemDescriptions: item.itemDescriptions,
      });
    }

    try {
      setUpdate(true);
      const res = await updatePlace(data.id, dataUpdate);
      if (res) {
        setValues(res.place);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Updated place successfully!",
          status: "success",
        });
        setUpdate(false);
        setDialog(false);
      }
    } catch (e) {
      setUpdate(false);
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Something went wrong with processing!",
        status: "error",
      });
    }
  };
  return (
    <Dialog
      open={dialog}
      fullWidth
      maxWidth="xl"
      onClose={() => setDialog(false)}
    >
      <DialogTitle>Update Place Informations</DialogTitle>

      <DialogContent sx={{ paddingX: 10 }}>
        <Grid container spacing={2}>
          <Grid item sm={12} lg={6}>
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
              marginBottom={1}
            >
              General Information
            </Typography>

            <Box paddingX={1}>
              <Box display="flex" marginBottom={1}>
                <Box>
                  <Typography width={150}>
                    Place Name{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  disabled={update}
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  value={data?.name}
                  {...register("name", {
                    required: "Place name is required!",
                    validate: (value) => {
                      return value.trim() !== "" || "Place name is not empty!";
                    },
                    onChange: (e) => setData({ ...data, name: e.target.value }),
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder={`Type place name here`}
                />
              </Box>

              <Box display="flex" marginBottom={1}>
                <Box>
                  <Typography width={150}>
                    Price{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  value={data?.price}
                  {...register("price", {
                    required: "Price is required!",
                    onChange: (e) =>
                      setData({ ...data, price: Number(e.target.value) }),
                  })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                    inputComponent: NumericFormatCustom,
                  }}
                  placeholder="Price of place"
                />
              </Box>

              <Box display="flex" marginBottom={1}>
                <Box>
                  <Typography width={150}>Entry Ticket </Typography>
                  <Typography fontSize={10} color={theme.palette.text.active}>
                    (if have)
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  value={data?.entryTicket}
                  onChange={(e) =>
                    setData({ ...data, entryTicket: Number(e.target.value) })
                  }
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                    inputComponent: NumericFormatCustom,
                  }}
                  placeholder="Entry ticket of place"
                />
              </Box>

              <Box display="flex" marginBottom={1}>
                <Box>
                  <Typography width={150}>
                    Duration{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                  <Typography fontSize={10}>
                    Estimated place completion time.
                  </Typography>
                </Box>
                <Controller
                  control={control}
                  name="hour"
                  rules={{
                    validate: (value) => {
                      return (
                        (!dayjs(value).isSame(dayjs("2022-04-17T00:00")) &&
                          value !== null) ||
                        "Duration is required!"
                      );
                    },
                  }}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimeField
                          {...field}
                          fullWidth
                          size="small"
                          InputProps={{
                            style: {
                              borderRadius: 10,
                            },
                          }}
                          value={
                            dayjs(field.value).isValid()
                              ? field.value
                              : dayjs("2022-04-17T" + field.value)
                          }
                          format="HH:mm:ss"
                          onChange={(newValue) => {
                            field.onChange(newValue);
                            setData({ ...data, hour: newValue });
                          }}
                          error={!!error}
                          helperText={error?.message}
                        />
                      </LocalizationProvider>
                    );
                  }}
                />
              </Box>

              <Box display="flex" marginBottom={1}>
                <Box>
                  <Typography width={150}>
                    Category{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                </Box>
                <Controller
                  control={control}
                  name="placeCategories"
                  rules={{ required: "Please select an option!" }}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        fullWidth
                        multiple
                        size="small"
                        sx={{
                          ".MuiOutlinedInput-root": {
                            borderRadius: 2.5,
                          },
                        }}
                        {...field}
                        filterSelectedOptions
                        options={categories}
                        isOptionEqualToValue={(option, value) =>
                          option.name === value.name
                        }
                        getOptionLabel={(option) => option.name}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={
                              getValues("placeCategories")?.length === 0
                                ? "Select one or more categories"
                                : ""
                            }
                            error={!!errors.placeCategories}
                            helperText={
                              errors.placeCategories
                                ? errors.placeCategories.message
                                : null
                            }
                          />
                        )}
                      />
                    );
                  }}
                />
              </Box>

              <Box display="flex" marginBottom={1}>
                <Box>
                  <Typography width={150}>
                    Place Address{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  value={data?.address}
                  {...register("address", {
                    required: "Address is required!",
                    onChange: (e) =>
                      setData({ ...data, address: e.target.value }),
                  })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  placeholder={`Type place address here`}
                />
              </Box>

              <Box display="flex" marginBottom={1}>
                <Box>
                  <Typography width={150}>
                    Latitude{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  value={data?.latitude}
                  {...register("latitude", {
                    required: "Latitude is required!",
                    validate: (value) => {
                      return (
                        (value < 90 && value > -90) ||
                        "Latitude out of range -90 to 90!"
                      );
                    },
                    defaultValue: 0,
                    onChange: (e) => {
                      setData({
                        ...data,
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
                    min: -90,
                    max: 90,
                  }}
                  placeholder={`Type latitude here`}
                />
              </Box>

              <Box display="flex" marginBottom={1}>
                <Box>
                  <Typography width={150}>
                    Longitude{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  value={data?.longitude}
                  {...register("longitude", {
                    required: "Longitude is required!",
                    validate: (value) => {
                      return (
                        (value < 180 && value > -180) ||
                        "Longitude out of range -180 to 180!"
                      );
                    },
                    defaultValue: 0,
                    onChange: (e) => {
                      setData({
                        ...data,
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
              </Box>

              <Box display="flex" marginBottom={1}>
                <Box>
                  <Typography width={150}>Google Place ID</Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  value={data?.googlePlaceId}
                  onChange={(e) =>
                    setData({ ...data, googlePlaceId: e.target.value })
                  }
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  placeholder={`Type google placeID here`}
                />
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              marginTop={3}
            >
              <Typography
                fontSize={14}
                letterSpacing={0.5}
                fontWeight="medium"
                textTransform="uppercase"
                color={theme.palette.text.third}
              >
                Image List
              </Typography>

              <Button component="label">
                Add Images{" "}
                <input
                  hidden
                  type="file"
                  accept="image/jpeg, image/png"
                  multiple
                  onChange={handleChangeImages}
                />
              </Button>
            </Box>
            {data?.placeImages ? (
              <ImageList
                variant="standard"
                cols={3}
                gap={2}
                sx={{ maxHeight: 500, marginTop: 1, paddingX: 1 }}
              >
                {data?.placeImages?.map((item, index) => (
                  <ImageListItem key={index}>
                    <ImageListItemBar
                      sx={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                          "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                      }}
                      position="top"
                      actionPosition="left"
                      actionIcon={
                        <>
                          <IconButton
                            key="star"
                            title={
                              item.isPrimary
                                ? "Primary image"
                                : "Make primary image"
                            }
                            onClick={(e) => changePrimaryImage(index)}
                            sx={{
                              color: item.isPrimary
                                ? theme.palette.text.pending
                                : theme.palette.text.second,
                            }}
                          >
                            <StarFill width={18} />
                          </IconButton>
                          {item.isPrimary ? null : (
                            <IconButton
                              key="remove"
                              title="Remove Image"
                              onClick={(e) => removeImage(index)}
                              sx={{ color: theme.palette.text.active }}
                            >
                              <CloseOutline width={28} />
                            </IconButton>
                          )}
                        </>
                      }
                    />

                    <img
                      src={previewImage(item.image)}
                      alt={index}
                      loading="lazy"
                      style={{
                        maxWidth: 300,
                        maxHeight: 300,
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : null}
          </Grid>

          <Grid item sm={12} lg={6}>
            <MapCoordinates values={data} setValues={setData} />

            <Box marginTop={6}>
              <Typography
                fontSize={14}
                letterSpacing={0.5}
                fontWeight="medium"
                textTransform="uppercase"
                color={theme.palette.text.third}
              >
                Date Of Week
              </Typography>

              {dateOfWeek()?.map((data, index) => (
                <Grid
                  key={index}
                  container
                  paddingX={1}
                  marginTop={0.25}
                  spacing={1}
                >
                  <Grid item xs={12} lg={4}>
                    <Typography width={100}>{data.day}</Typography>
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
      </DialogContent>
      <DialogActions sx={{ padding: 3 }}>
        <Button
          variant="outlined"
          onClick={handleSubmit(onUpdate)}
          disabled={update}
          autoFocus
        >
          Update
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={update}
          onClick={() => setDialog(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogUpdate;
