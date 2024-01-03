import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Switch,
  TextField,
  Typography,
  Tooltip,
  useTheme,
} from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

import { updateTour } from "../../action";

const DialogUpdateLangs = ({
  dialog,
  setDialog,
  setValues,
  fields,
  control,
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

  const getLanguage = (code) => {
    return languages.filter((language) => language.languageCode === code);
  };

  const onUpdate = async () => {
    let dataUpdate = {
      name: getValues("name"),
      image: getValues("image"),
      total: getValues("total"),
      tourDetails: [],
      tourDescriptions: [],
    };
    for (const tour of getValues("tourDetails")) {
      dataUpdate.tourDetails.push({ id: tour.id, price: tour.price });
    }

    for (const tour of getValues("tourDescriptions")) {
      dataUpdate.tourDescriptions.push({
        name: tour.name,
        description: tour.description,
        createTime: tour.createTime,
        languageCode: tour.languageCode,
        status: tour.status ? 1 : 0,
      });
    }

    try {
      setUpdate(true);
      const res = await updateTour(getValues().id, dataUpdate);
      if (res) {
        setValues(res.tour);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Updated itinerary successfully!",
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
      <DialogTitle>Update Itinerary Descriptions</DialogTitle>

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
                    <Typography fontWeight="medium" textTransform="uppercase">
                      {getLanguage(item.languageCode)[0]?.name}
                    </Typography>
                  </Box>
                  <Controller
                    control={control}
                    name={`tourDescriptions.${index}.status`}
                    render={({ field }) => (
                      <Tooltip title={field.value ? "Deactive" : "Active"}>
                        <Switch
                          checked={field.value === 1 ? true : field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          inputProps={{ "aria-label": "controlled" }}
                          color="error"
                        />
                      </Tooltip>
                    )}
                  />
                </Box>
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
                  disabled={update}
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  {...register(`tourDescriptions.${index}.name`, {
                    validate: (value) => {
                      return value.trim() !== "" || "Tour name is not empty!";
                    },
                    required: "Tour Name is required!",
                  })}
                  error={!!errors.tourDescriptions?.[index]?.name}
                  helperText={errors.tourDescriptions?.[index]?.name?.message}
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
                  {...register(`tourDescriptions.${index}.description`, {
                    validate: (value) => {
                      return value.trim() !== "" || "Description is not empty!";
                    },
                    required: "Description is required!",
                  })}
                  error={!!errors.tourDescriptions?.[index]?.description}
                  helperText={
                    errors.tourDescriptions?.[index]?.description?.message
                  }
                  placeholder="Type description here"
                />
              </Grid>
              <Divider />
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

export default DialogUpdateLangs;
