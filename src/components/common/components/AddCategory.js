import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { Add } from "@styled-icons/ionicons-solid";
import { Trash3 } from "@styled-icons/bootstrap";

const AddCategory = ({
  values,
  setValues,
  loading,
  categoryLanguages,
  setCategoryLanguages,
  languageList,
  register,
  errors,
  clearErrors,
}) => {
  const theme = useTheme();
  const handleChange = (event) => {
    setValues({ ...values, name: event.target.value });
  };

  const handleChangeCategories = (index, event) => {
    clearErrors(["languageCode", "nameLanguage"]);
    const values = [...categoryLanguages];
    values[index][event.target.name] = event.target.value;
    setCategoryLanguages(values);
  };

  const handleAddFields = () => {
    clearErrors(["languageCode", "nameLanguage"]);
    const data = [...categoryLanguages];
    if (data.length < languageList.length) {
      setCategoryLanguages([
        ...categoryLanguages,
        { languageCode: "zh-cn", nameLanguage: "" },
      ]);
    }
  };

  const handleRemoveFields = (index) => {
    clearErrors(["languageCode", "nameLanguage"]);
    const data = [...categoryLanguages];
    if (data.length > 1) {
      data.splice(index, 1);
      setCategoryLanguages(data);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={3}
        marginBottom={4}
      >
        <Typography sx={{ width: 220 }}>
          Category Name{" "}
          <small style={{ color: theme.palette.text.active }}>*</small>
        </Typography>
        <TextField
          fullWidth
          name="name"
          size="small"
          InputProps={{
            style: {
              borderRadius: 10,
            },
          }}
          value={values.name}
          {...register("name", {
            onChange: handleChange,
            validate: (value, formValues) => value.trim() !== "",
            required: "Category Name is required!",
          })}
          disabled={loading}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </Box>

      <Box
        paddingX={3}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="semiBold">
            Category subtitles in other languages
          </Typography>
          {categoryLanguages.length === languageList.length ? null : (
            <Button disabled={loading} onClick={handleAddFields}>
              <Add width={20} sx={{ marginRight: 10 }} />
              Add Languages
            </Button>
          )}
        </Box>

        {categoryLanguages.map((category, index) => (
          <Box key={index} marginTop={1}>
            <Typography
              color={theme.palette.text.third}
              marginLeft={1}
              fontSize={14}
            >
              National {index + 1}{" "}
              <small style={{ color: theme.palette.text.active }}>*</small>
            </Typography>
            <Grid container columnSpacing={2} marginBottom={1}>
              <Grid item md={5}>
                <FormControl fullWidth size="small">
                  <Select
                    value={category.languageCode}
                    sx={{ borderRadius: 2.5 }}
                    name="languageCode"
                    fullWidth
                    disabled={loading}
                    onChange={(event) => handleChangeCategories(index, event)}
                  >
                    {languageList.map((item) => (
                      <MenuItem key={item.id} value={item.languageCode}>
                        <img
                          src={item.icon}
                          alt={item.name}
                          style={{ width: 20, marginRight: 10 }}
                        />
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={5}>
                <TextField
                  fullWidth
                  name="nameLanguage"
                  value={category.nameLanguage}
                  size="small"
                  disabled={loading}
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  onChange={(event) => handleChangeCategories(index, event)}
                />
              </Grid>
              <Grid item md={2}>
                {categoryLanguages.length === 1 ? null : (
                  <IconButton
                    disabled={loading}
                    onClick={() => handleRemoveFields(index)}
                    color="error"
                  >
                    <Trash3 width={20} />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box>
          <FormHelperText htmlFor="render-select" error>
            {errors.languageCode?.message || errors.nameLanguage?.message}
          </FormHelperText>
        </Box>
      </Box>
    </Box>
  );
};

export default AddCategory;
