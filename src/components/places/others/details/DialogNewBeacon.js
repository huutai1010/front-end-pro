import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormHelperText,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { CloudArrowUp } from "@styled-icons/fluentui-system-regular";

import { updatePlace } from "../../action";
import { imageFileTypes } from "../../../../constants/fileType";

const DialogNewBeacon = ({
  dialog,
  setDialog,
  setValues,
  getValuesTotal,
  update,
  setUpdate,
  notification,
  setNotification,
}) => {
  const theme = useTheme();

  const {
    getValues,
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    var arrLang = [];
    if (Array.isArray(getValuesTotal("placeDescriptions"))) {
      for (const desc of getValuesTotal("placeDescriptions")) {
        arrLang.push({
          languageCode: desc.languageCode,
          languageIcon: desc.languageIcon,
          languageName: desc.languageName,
          nameItem: "",
        });
      }
    }
    reset({
      name: "",
      beaconId: "",
      image: "",
      startTime: "00:00:00",
      endTime: "00:00:00",
      beaconMajorNumber: 1,
      beaconMinorNumber: 1,
      itemDescriptions: arrLang,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  const { fields } = useFieldArray({
    control: control,
    name: "itemDescriptions",
  });

  const previewImage = (image) => {
    if (image instanceof File && imageFileTypes.includes(image.type)) {
      return URL.createObjectURL(image);
    }

    return image;
  };

  const onUpdate = async () => {
    let dataUpdate = {
      name: getValuesTotal("name"),
      longitude: getValuesTotal("longitude"),
      latitude: getValuesTotal("latitude"),
      address: getValuesTotal("address"),
      hour: getValuesTotal("hour"),
      googlePlaceId: getValuesTotal("googlePlaceId"),
      price: getValuesTotal("price"),
      entryTicket: getValuesTotal("entryTicket"),
      placeCategories: [],
      placeImages: [],
      placeDescriptions: [],
      placeTimes: [],
      placeItems: [],
    };

    for (const cate of getValuesTotal("placeCategories")) {
      dataUpdate.placeCategories.push({ id: cate.id });
    }

    for (const img of getValuesTotal("placeImages")) {
      dataUpdate.placeImages.push({
        image: img.image,
        isPrimary: img.isPrimary,
      });
    }

    for (const desc of getValuesTotal("placeDescriptions")) {
      dataUpdate.placeDescriptions.push({
        languageCode: desc.languageCode,
        voiceFile:
          desc.voiceFile instanceof File ? desc.voiceFile.name : desc.voiceFile,
        name: desc.name,
        description: desc.description,
        status: desc.status,
      });
    }

    for (const time of getValuesTotal("placeTimes")) {
      dataUpdate.placeTimes.push({
        daysOfWeek: time.daysOfWeek,
        openTime: time.openTime,
        endTime: time.endTime,
      });
    }

    for (const item of getValuesTotal("placeItems")) {
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

    dataUpdate.placeItems.push({
      name: getValues("name"),
      beaconId: getValues("beaconId"),
      image: getValues("image"),
      startTime: dayjs(getValues("startTime")).format("HH:mm:ss"),
      endTime: dayjs(getValues("endTime")).format("HH:mm:ss"),
      beaconMajorNumber: getValues("beaconMajorNumber"),
      beaconMinorNumber: getValues("beaconMinorNumber"),
      itemDescriptions: getValues("itemDescriptions"),
    });

    try {
      setUpdate(true);
      const res = await updatePlace(getValuesTotal().id, dataUpdate);
      if (res) {
        setValues(res.place);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Create location successfully!",
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
      maxWidth="lg"
      sx={{ "& .MuiDialog-paper": { overflowY: "hidden" } }}
      onClose={() => setDialog(false)}
    >
      <DialogTitle>Create New Position</DialogTitle>

      <DialogContent sx={{ paddingX: 10 }}>
        <Grid container spacing={3}>
          <Grid item sm={12} lg={6}>
            <Box marginBottom={1}>
              <Typography
                fontSize={14}
                letterSpacing={0.5}
                fontWeight="medium"
                textTransform="uppercase"
                color={theme.palette.text.third}
              >
                General Information
              </Typography>
            </Box>
            {/* Beacon Name */}
            <Box marginBottom={2}>
              <Typography marginLeft={1}>
                Position Name{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
              </Typography>
              <TextField
                fullWidth
                size="small"
                disabled={update}
                InputProps={{
                  style: {
                    borderRadius: 10,
                  },
                }}
                {...register("name", {
                  validate: (value) => {
                    return value.trim() !== "" || "Beacon name is not empty!";
                  },
                  required: "Beacon Name is required!",
                })}
                error={!!errors.name}
                helperText={errors?.name?.message}
                placeholder="Type beacon name here"
              />
            </Box>

            {/* Beacon Code */}
            <Box marginBottom={2}>
              <Typography marginLeft={1}>
                Beacon Code{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
              </Typography>
              <TextField
                fullWidth
                size="small"
                disabled={update}
                InputProps={{
                  style: {
                    borderRadius: 10,
                  },
                }}
                {...register("beaconId", {
                  validate: (value) => {
                    return value.trim() !== "" || "Beacon code is not empty!";
                  },
                  required: "Beacon code is required!",
                })}
                error={!!errors.beaconId}
                helperText={errors.beaconId?.message}
                placeholder="Type beacon code here"
              />
            </Box>

            {/* Start Time */}
            <Box marginBottom={2}>
              <Typography marginLeft={1}>
                Start Time{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
              </Typography>
              <Controller
                control={control}
                name="startTime"
                rules={{
                  validate: (value) => {
                    return (
                      !dayjs(value).isSame(dayjs("2022-04-17T00:00:00")) ||
                      "Start time must be different from 00:00:00!"
                    );
                  },
                }}
                render={({ field, fieldState: { error } }) => (
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
                      onChange={(newValue) => field.onChange(newValue)}
                      error={!!error}
                      helperText={error?.message}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>

            {/* End Time */}
            <Box marginBottom={2}>
              <Typography marginLeft={1}>
                End Time{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
              </Typography>
              <Controller
                control={control}
                name="endTime"
                rules={{
                  validate: (value) => {
                    return (
                      (!dayjs(value).isSame(dayjs("2022-04-17T00:00:00")) &&
                        dayjs(value).isAfter(dayjs(getValues("startTime")))) ||
                      "End time must be different from 00:00:00 and must be greater than start time!"
                    );
                  },
                }}
                render={({ field, fieldState: { error } }) => (
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
                      }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>

            {/* Beacon Major */}
            <Box marginBottom={2}>
              <Typography marginLeft={1}>Beacon Major Number</Typography>
              <Controller
                control={control}
                name="beaconMajorNumber"
                disabled={update}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    size="small"
                    sx={{
                      borderRadius: 2.5,
                    }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                  </Select>
                )}
              />
            </Box>

            {/* Beacon Minor */}
            <Box marginBottom={2}>
              <Typography marginLeft={1}>Beacon Minor Number</Typography>
              <Controller
                control={control}
                name="beaconMinorNumber"
                disabled={update}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    size="small"
                    sx={{
                      borderRadius: 2.5,
                    }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                  </Select>
                )}
              />
            </Box>
          </Grid>

          <Grid item sm={12} lg={6}>
            <Box marginBottom={1}>
              <Typography
                fontSize={14}
                letterSpacing={0.5}
                fontWeight="medium"
                textTransform="uppercase"
                color={theme.palette.text.third}
              >
                Names By Language
              </Typography>
            </Box>
            {/* Descriptions */}

            {fields.map((item, index) => (
              <Box key={item.id} marginBottom={2}>
                <Box display="flex" alignItems="center">
                  <img
                    src={item.languageIcon}
                    alt=""
                    style={{
                      width: 20,
                      height: 12,
                      border: 1,
                      borderColor: theme.palette.background.third,
                    }}
                  />
                  <Typography marginLeft={1}>
                    {item.languageName}{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                </Box>

                <TextField
                  key={item.id}
                  fullWidth
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  {...register(`itemDescriptions.${index}.nameItem`, {
                    validate: (value) => {
                      return value.trim() !== "" || "Name is not empty!";
                    },
                    required: "Name by language is required!",
                  })}
                  error={!!errors.itemDescriptions?.[index]?.nameItem}
                  helperText={
                    errors?.itemDescriptions?.[index]?.nameItem?.message
                  }
                  placeholder={`Name by ${item.languageName}`}
                />
              </Box>
            ))}

            <Box marginTop={9}>
              <Typography
                fontSize={14}
                letterSpacing={0.5}
                fontWeight="medium"
                textTransform="uppercase"
                color={theme.palette.text.third}
              >
                Image
              </Typography>
            </Box>
            <Box>
              <Typography marginLeft={1}>
                Upload Image{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
              </Typography>
              <Controller
                control={control}
                name="image"
                rules={{
                  required: "Image is required!",
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Box
                      display="flex"
                      alignItems="center"
                      border={1}
                      borderRadius={2.5}
                      borderColor={
                        error
                          ? theme.palette.text.active
                          : alpha(theme.palette.text.primary, 0.28)
                      }
                      height={40}
                    >
                      <label
                        style={{
                          display: "flex",
                          width: "100%",
                          color: theme.palette.text.third,
                          cursor: "pointer",
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          color={alpha(theme.palette.text.secondary, 0.4)}
                        >
                          <CloudArrowUp height={24} style={{ margin: 10 }} />
                          {field.value ? (
                            <Typography noWrap>
                              {field.value instanceof File
                                ? field.value.name
                                : "Image is uploaded..."}
                            </Typography>
                          ) : (
                            <Typography noWrap>
                              Click to upload image
                            </Typography>
                          )}
                        </Box>

                        <input
                          type="file"
                          disabled={update}
                          accept="image/jpeg, image/png"
                          style={{
                            opacity: 0,
                            position: "absolute",
                          }}
                          onChange={(e) => {
                            field.onChange(e.target.files[0]);
                          }}
                        />
                      </label>
                    </Box>
                    <FormHelperText
                      htmlFor="render-select"
                      error
                      sx={{ marginLeft: 2 }}
                    >
                      {error?.message}
                    </FormHelperText>
                    <Box marginY={2} display="flex" justifyContent="center">
                      <img
                        src={previewImage(field.value)}
                        style={{
                          borderRadius: 10,
                          maxWidth: "100%",
                          maxHeight: 300,
                        }}
                        alt=""
                      />
                    </Box>
                  </>
                )}
              />
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
          Confirm
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

export default DialogNewBeacon;
