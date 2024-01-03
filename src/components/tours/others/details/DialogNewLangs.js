import {
  Button,
  Divider,
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
import { updateTour } from "../../action";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";

const DialogNewLangs = ({
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
    },
  });

  const onUpdate = async () => {
    let dataUpdate = {
      name: getValuesTotal("name"),
      image: getValuesTotal("image"),
      total: getValuesTotal("total"),
      tourDetails: [],
      tourDescriptions: [],
    };
    for (const desc of getValuesTotal("tourDescriptions")) {
      dataUpdate.tourDescriptions.push({
        name: desc.name,
        description: desc.description,
        languageCode: desc.languageCode,
        createTime: desc.createTime,
      });
    }

    dataUpdate.tourDescriptions.push({
      name: getValues().name,
      description: getValues().description,
      languageCode: getValues().languageCode,
      createTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
    });
    for (const place of getValuesTotal("tourDetails")) {
      dataUpdate.tourDetails.push({ id: place.id, price: place.price });
    }

    try {
      setUpdate(true);
      const res = await updateTour(getValuesTotal().id, dataUpdate);
      if (res) {
        reset({
          languageCode: "",
          name: "",
          description: "",
        });
        setValues(res.tour);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Create itinerary descriptions successfully!",
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
      <DialogTitle>Create Itinerary Descriptions</DialogTitle>

      <DialogContent sx={{ paddingX: 10 }}>
        <Grid container spacing={2} paddingY={2}>
          <Grid item sm={12} lg={3}>
            <Typography fontWeight="medium">
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
                  <FormHelperText
                    htmlFor="render-select"
                    error
                    sx={{ marginLeft: 2 }}
                  >
                    {error?.message}
                  </FormHelperText>
                </>
              )}
            />
          </Grid>

          <Grid item sm={12} lg={3}>
            <Typography fontWeight="medium">
              Itinerary Name{" "}
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
            <Typography fontWeight="medium">
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
          <Divider />
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

export default DialogNewLangs;
