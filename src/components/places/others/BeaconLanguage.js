import { Box, Grid, TextField, Typography, useTheme } from "@mui/material";
import React from "react";
import { useFieldArray } from "react-hook-form";

const BeaconLanguage = ({
  languageList,
  beaconIndex,
  control,
  register,
  errors,
}) => {
  const theme = useTheme();
  const { fields } = useFieldArray({
    control,
    name: `placeItems.${beaconIndex}.itemDescriptions`,
  });

  const getLanguage = (languagecode) => {
    const value = languageList.filter(
      (field) => field.languageCode === languagecode
    );
    return value;
  };

  return (
    <Box marginTop={1}>
      {fields.map((item, i) => (
        <Grid container key={item.id} spacing={1}>
          <Grid item sm={12}>
            <Box display="flex" alignItems="center" marginLeft={1}>
              <img
                src={getLanguage(item.languageCode)[0]?.icon}
                alt=""
                style={{
                  width: 20,
                  height: 12,
                  border: 1,
                  borderColor: theme.palette.background.third,
                }}
              />
              <Typography marginLeft={1} color={theme.palette.text.third}>
                {getLanguage(item.languageCode)[0]?.name}{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
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
              {...register(
                `placeItems.${beaconIndex}.itemDescriptions.${i}.nameItem`,
                {
                  validate: (value) => {
                    return value.trim() !== "" || "Name is not empty!";
                  },
                  required: "Name by language is required!",
                }
              )}
              error={
                !!errors.placeItems?.[beaconIndex]?.itemDescriptions?.[i]
                  ?.nameItem
              }
              helperText={
                errors.placeItems?.[beaconIndex]?.itemDescriptions?.[i]
                  ?.nameItem?.message
              }
              placeholder={`Position name by ${
                getLanguage(item.languageCode)[0]?.name
              } `}
            />
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default BeaconLanguage;
