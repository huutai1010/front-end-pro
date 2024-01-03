import {
  Button,
  Box,
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
  useTheme,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { updatePlace } from "../../action";
import { Voiceprint } from "@styled-icons/remix-fill";
import { mp3FileTypes } from "../../../../constants/fileType";

const DialogNewLang = ({
  dialog,
  setDialog,
  setValues,
  getValuesTotal,
  languages,
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
  } = useForm({
    defaultValues: {
      languageCode: "",
      name: "",
      description: "",
      voiceFile: "",
    },
  });

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
        voiceFile: desc.voiceFile,
        name: desc.name,
        description: desc.description,
        status: desc.status,
      });
    }
    dataUpdate.placeDescriptions.push({
      languageCode: getValues("languageCode"),
      voiceFile: getValues("voiceFile").name,
      name: getValues("name"),
      description: getValues("description"),
    });

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

    try {
      setUpdate(true);
      const res = await updatePlace(getValuesTotal().id, dataUpdate, [
        getValues(),
      ]);
      if (res) {
        reset({
          languageCode: "",
          name: "",
          description: "",
          voiceFile: "",
        });
        setValues(res.place);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Create place descriptions successfully!",
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
      <DialogTitle>Create Place Descriptions</DialogTitle>

      <DialogContent sx={{ paddingX: 10 }}>
        <Grid container spacing={2} paddingY={2}>
          <Grid item sm={12} lg={3}>
            <Typography>
              Choose Language{" "}
              <small style={{ color: theme.palette.text.active }}>*</small>
            </Typography>
          </Grid>
          <Grid item sm={12} lg={9}>
            <Controller
              control={control}
              disabled={update}
              name="languageCode"
              rules={{
                required: "Language is required!",
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Select
                    {...field}
                    fullWidth
                    size="small"
                    sx={{
                      borderRadius: 2.5,
                    }}
                    error={!!error}
                  >
                    {languages.map((item) => (
                      <MenuItem key={item.id} value={item.languageCode}>
                        <img
                          src={item.icon}
                          alt={item.name}
                          style={{
                            width: 16,
                            border: "1px solid #ccc",
                            marginRight: 10,
                          }}
                        />
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error sx={{ marginLeft: 2 }}>
                    {error?.message}
                  </FormHelperText>
                </>
              )}
            />
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
              size="small"
              disabled={update}
              InputProps={{
                style: {
                  borderRadius: 10,
                },
              }}
              {...register(`name`, {
                validate: (value) => {
                  return value.trim() !== "" || "Tour name is not empty!";
                },
                required: "Tour Name is required!",
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
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
              rows={7}
              multiline
              size="small"
              disabled={update}
              InputProps={{
                style: {
                  borderRadius: 10,
                },
              }}
              {...register(`description`, {
                validate: (value) => {
                  return value.trim() !== "" || "Description is not empty!";
                },
                required: "Description is required!",
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
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
                htmlFor="voiceFile"
                sx={{ borderRadius: 2.5, width: 180, height: 35, gap: 0.5 }}
                variant="contained"
              >
                <Voiceprint width={20} />
                <Typography fontSize={14}>Upload file</Typography>
              </Button>
              <Controller
                name="voiceFile"
                control={control}
                rules={{
                  required: "Voice file is required!",
                  validate: (e) =>
                    mp3FileTypes.includes(e.type) ||
                    " The file is not voice file!",
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="voiceFile"
                      type="file"
                      hidden
                      onChange={(e) => field.onChange(e.target.files[0])}
                      accept="audio/mpeg, audio/mp3"
                    />

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      {field.value.name}
                    </Box>
                  </>
                )}
              />
            </Box>

            <FormHelperText error sx={{ marginLeft: 2 }}>
              {errors?.voiceFile?.message}
            </FormHelperText>
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

export default DialogNewLang;
