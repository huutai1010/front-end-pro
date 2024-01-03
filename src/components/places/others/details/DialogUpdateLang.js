import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  useTheme,
} from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";
import { Controller } from "react-hook-form";

import { updatePlace } from "../../action";

import { Voiceprint } from "@styled-icons/remix-fill";
import { CloseOutline } from "@styled-icons/evaicons-outline";

const DialogUpdateLang = ({
  dialog,
  setDialog,
  setValues,
  fields,
  control,
  resetField,
  register,
  errors,
  getValues,
  handleSubmit,
  languages,
  update,
  setUpdate,
  notification,
  setNotification,
}) => {
  const theme = useTheme();
  const MAXIMUM_FILE_SIZE = 70 * 1024 * 1024;

  const getLanguage = (code) => {
    return languages.filter((language) => language.languageCode === code);
  };

  const hasDuplicate = () => {
    const data = getValues("placeDescriptions");
    const voiceFile = new Set();
    for (const value of data) {
      if (value.voiceFile instanceof File) {
        if (voiceFile.has(value.voiceFile.name)) {
          return false;
        }
        if (value.voiceFile?.size > MAXIMUM_FILE_SIZE) {
          return false;
        }
        voiceFile.add(value.voiceFile.name);
      }
    }

    return true;
  };

  const onUpdate = async () => {
    const descData = getValues("placeDescriptions");
    let dataUpdate = {
      name: getValues("name"),
      longitude: getValues("longitude"),
      latitude: getValues("latitude"),
      address: getValues("address"),
      hour: getValues("hour"),
      googlePlaceId: getValues("googlePlaceId"),
      price: getValues("price"),
      entryTicket: getValues("entryTicket"),
      placeCategories: [],
      placeImages: [],
      placeDescriptions: [],
      placeTimes: [],
      placeItems: [],
    };

    for (const cate of getValues("placeCategories")) {
      dataUpdate.placeCategories.push({ id: cate.id });
    }

    for (const img of getValues("placeImages")) {
      dataUpdate.placeImages.push({
        image: img.image,
        isPrimary: img.isPrimary,
      });
    }

    for (const desc of descData) {
      dataUpdate.placeDescriptions.push({
        languageCode: desc.languageCode,
        voiceFile:
          desc.voiceFile instanceof File ? desc.voiceFile.name : desc.voiceFile,
        name: desc.name,
        description: desc.description,
        status: desc.status,
      });
    }

    for (const time of getValues("placeTimes")) {
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
      const res = await updatePlace(getValues().id, dataUpdate, descData);
      if (res) {
        setValues(res.place);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Updated place descriptions successfully!",
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
      onClose={() => setDialog(false)}
    >
      <DialogTitle>Update Place Descriptions</DialogTitle>

      <DialogContent sx={{ paddingX: 10 }}>
        {fields.map((item, index) => (
          <Box key={index}>
            {index === 0 ? null : <Divider />}
            <Grid container spacing={2} paddingY={2}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={2}>
                    <img
                      src={getLanguage(item.languageCode)[0]?.icon}
                      alt={getLanguage(item.languageCode)[0]?.name}
                      style={{
                        width: 20,
                        border: "1px solid #ccc",
                      }}
                    />
                    <Typography textTransform="uppercase">
                      {getLanguage(item.languageCode)[0]?.name}
                    </Typography>
                    {item.status === 1 ? (
                      <Typography
                        fontSize={12}
                        color={theme.palette.text.active}
                      >
                        This description will be updated after the file
                        converting procedure is complete.
                      </Typography>
                    ) : null}
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography>Status</Typography>
                    <Controller
                      disabled={item.status === 1}
                      control={control}
                      name={`placeDescriptions.${index}.status`}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          size="small"
                          sx={{
                            borderRadius: 2.5,
                          }}
                        >
                          {item.status !== 3 ? (
                            <MenuItem value={0}>
                              <Typography
                                color={theme.palette.text.active}
                                fontWeight="medium"
                              >
                                Deactive
                              </Typography>
                            </MenuItem>
                          ) : null}
                          {item.status !== 1 ? null : (
                            <MenuItem value={1}>
                              <Typography
                                color={theme.palette.text.pending}
                                fontWeight="medium"
                              >
                                Preparing
                              </Typography>
                            </MenuItem>
                          )}
                          {item.status !== 3 ? (
                            <MenuItem value={2}>
                              <Typography
                                color={theme.palette.text.onStatus}
                                fontWeight="medium"
                              >
                                Active
                              </Typography>
                            </MenuItem>
                          ) : null}
                          {item.status !== 3 ? null : (
                            <MenuItem value={3}>
                              <Typography
                                color={theme.palette.text.active}
                                fontWeight="medium"
                              >
                                Error
                              </Typography>
                            </MenuItem>
                          )}
                        </Select>
                      )}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item sm={12} lg={3}>
                <Typography>
                  Place Name{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
              </Grid>
              <Grid item sm={12} lg={9}>
                <TextField
                  fullWidth
                  disabled={update || item.status === 1}
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  {...register(`placeDescriptions.${index}.name`, {
                    validate: (value) => {
                      return value.trim() !== "" || "Tour name is not empty!";
                    },
                    required: "Tour Name is required!",
                  })}
                  error={!!errors.placeDescriptions?.[index]?.name}
                  helperText={errors.placeDescriptions?.[index]?.name?.message}
                  placeholder="Type tour name here"
                />
              </Grid>

              {/* Tour Decription */}
              <Grid item sm={12} lg={3}>
                <Typography>
                  Decription{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
                <Typography>
                  <small>Write a short decription</small>
                </Typography>
              </Grid>
              <Grid item sm={12} lg={9}>
                <TextField
                  fullWidth
                  rows={12}
                  multiline
                  size="small"
                  disabled={update || item.status === 1}
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  {...register(`placeDescriptions.${index}.description`, {
                    validate: (value) => {
                      return value.trim() !== "" || "Description is not empty!";
                    },
                    required: "Description is required!",
                  })}
                  error={!!errors.placeDescriptions?.[index]?.description}
                  helperText={
                    errors.placeDescriptions?.[index]?.description?.message
                  }
                  placeholder="Type description here"
                />
              </Grid>

              {/* Voice File */}
              <Grid item sm={12} lg={3}>
                <Typography>
                  Voice File{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
              </Grid>
              <Grid item sm={12} lg={9}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    component="label"
                    disabled={update || item.status === 1}
                    sx={{ borderRadius: 2.5, width: 180, height: 35, gap: 0.5 }}
                    htmlFor={`placeDescriptions.${index}.voiceFile`}
                    variant="contained"
                  >
                    <Voiceprint width={20} />
                    <Typography fontSize={14}>Change File</Typography>
                  </Button>
                  <Controller
                    name={`placeDescriptions.${index}.voiceFile`}
                    control={control}
                    rules={{
                      required: "Voice file is required!",
                      validate: () => {
                        return (
                          hasDuplicate() ||
                          "This file has been duplicated or this file size is larger than 70 MB!"
                        );
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <input
                          id={`placeDescriptions.${index}.voiceFile`}
                          type="file"
                          hidden
                          onChange={(e) => field.onChange(e.target.files[0])}
                          accept="audio/mpeg, audio/mp3"
                        />

                        {field.value instanceof File ? (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                          >
                            {field.value.name}
                            <IconButton
                              onClick={(e) =>
                                resetField(
                                  `placeDescriptions.${index}.voiceFile`
                                )
                              }
                            >
                              <CloseOutline width={24} />
                            </IconButton>
                          </Box>
                        ) : (
                          <ReactPlayer
                            url={item.voiceFile}
                            controls={true}
                            height={40}
                            width="100%"
                          />
                        )}
                      </>
                    )}
                  />
                </Box>

                <FormHelperText
                  error
                  htmlFor={`placeDescriptions.${index}.voiceFile`}
                >
                  {errors?.placeDescriptions?.[index]?.voiceFile?.message}
                </FormHelperText>
              </Grid>
            </Grid>
          </Box>
        ))}
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

export default DialogUpdateLang;
