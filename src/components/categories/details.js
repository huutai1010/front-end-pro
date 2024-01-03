import { useTheme } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { getCategoryDetails, updateCategory } from "./action";

import Header from "../common/Header";

import { Add, Remove } from "styled-icons/material";
import ErrorModal from "../common/ErrorModal";

const CategoryDetails = () => {
  const theme = useTheme();
  const { state } = useLocation();
  const { categoryId, languageList } = state;
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [values, setValues] = useState({ name: "" });
  const [categoryLanguages, setCategoryLanguages] = useState([]);
  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const form = useForm({
    defaultValues: {
      name: "",
      categoryLanguages: [{ languageCode: "zh-cn", nameLanguage: "" }],
    },
  });
  const { register, reset, handleSubmit, setError, clearErrors, formState } =
    form;
  const { errors } = formState;

  useEffect(() => {
    async function getInfoDetails() {
      setLoading(true);
      try {
        const data = await getCategoryDetails(categoryId);
        setValues(data);
        setCategoryLanguages(data.categoryLanguages);
        reset(data);
        setLoading(false);
      } catch (error) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Can't get data details for category!",
          status: "error",
        });
        setLoading(false);
      }
    }
    getInfoDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleChangeCategories = (index, event) => {
    clearErrors(["languageCode", "nameLanguage"]);
    const values = [...categoryLanguages];
    values[index][event.target.name] = event.target.value;
    setCategoryLanguages(values);
  };

  const handleAddFields = () => {
    clearErrors(["languageCode", "nameLanguage"]);
    const value = [...categoryLanguages];
    if (value.length < languageList.length) {
      setCategoryLanguages([
        ...categoryLanguages,
        { languageCode: "zh-cn", nameLanguage: "" },
      ]);
    }
  };

  const handleRemoveFields = (index) => {
    clearErrors(["languageCode", "nameLanguage"]);
    const value = [...categoryLanguages];
    if (value.length > 1) {
      value.splice(index, 1);
      setCategoryLanguages(value);
    }
  };

  const isDuplicate = () => {
    const nameOccurrences = {};
    for (const obj of categoryLanguages) {
      if (nameOccurrences[obj.languageCode]) {
        return true;
      }
      nameOccurrences[obj.languageCode] = true;
    }
    return false;
  };

  const onSubmit = async () => {
    if (isDuplicate()) {
      return setError("languageCode", {
        message: "Duplicate language!",
      });
    }
    if (values.name.trim() === "") {
      return setError("name", {
        message: "Category Name not empty!",
      });
    }

    if (categoryLanguages.some((item) => item.nameLanguage.trim() === "")) {
      return setError("nameLanguage", {
        message: "Language Name not empty!",
      });
    }
    const data = { ...values, categoryLanguages: categoryLanguages };
    try {
      setUpdate(true);
      const res = await updateCategory(categoryId, data);
      if (res) {
        setUpdate(false);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Update category successfully!",
          status: "success",
        });
      }
    } catch (e) {
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Update category failed!",
        status: "error",
      });
      setUpdate(false);
    }
  };

  return (
    <Box
      minHeight="94vh"
      margin="1.25em"
      padding={2}
      paddingBottom={10}
      bgcolor={theme.palette.background.primary}
      borderRadius={5}
    >
      <ErrorModal
        open={notification.errorState}
        setOpen={setNotification}
        message={notification.errorMessage}
        status={notification.status}
      />

      <Header
        title={"Category Details"}
        subTitle={"Details information of the category."}
        showBack={true}
        loading={loading}
      />

      <Box marginX={6} padding={3} paddingX={25}>
        <Box display="flex" alignItems="center" gap={2} marginBottom={4}>
          {loading ? (
            <Skeleton width="100%" />
          ) : (
            <>
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
                  required: "Category Name is required!",
                })}
                onChange={handleChange}
                disabled={update}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </>
          )}
        </Box>

        <Box pading={2}>
          <Box display='flex' justifyContent='space-between'>
            {loading ? (
              <Skeleton width={200} />
            ) : (
              <Typography fontWeight="semiBold">
                Category subtitles in other languages
              </Typography>
            )}

            {loading ? (
              <Skeleton width={200} />
            ) : categoryLanguages.length === languageList.length ? null : (
              <Button disabled={update} onClick={handleAddFields} color="error">
                <Add width={24} />
                Add other languages
              </Button>
            )}
          </Box>

          {loading ? (
            <Skeleton width="100%" />
          ) : (
            categoryLanguages.map((data, index) => (
              <Box key={index} marginTop={1} paddingLeft={3}>
                <Typography
                  color={theme.palette.text.third}
                  marginLeft={1}
                  fontSize={14}
                >
                  Language {index + 1}{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
                <Grid container columnSpacing={2} marginBottom={1}>
                  <Grid item md={5}>
                    <FormControl fullWidth size="small">
                      <Select
                        fullWidth
                        name="languageCode"
                        disabled={update}
                        value={data.languageCode.trim()}
                        sx={{ borderRadius: 2.5 }}
                        onChange={(event) =>
                          handleChangeCategories(index, event)
                        }
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
                      size="small"
                      name="nameLanguage"
                      disabled={update}
                      InputProps={{
                        style: {
                          borderRadius: 10,
                        },
                      }}
                      value={data.nameLanguage}
                      onChange={(event) => handleChangeCategories(index, event)}
                    />
                  </Grid>
                  <Grid item md={2}>
                    {categoryLanguages.length === 1 ? null : (
                      <IconButton
                        disabled={update}
                        onClick={() => handleRemoveFields(index)}
                      >
                        <Remove width={24} />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))
          )}
          <Box>
            <FormHelperText htmlFor="render-select" error>
              {errors.languageCode?.message || errors.nameLanguage?.message}
            </FormHelperText>
          </Box>
        </Box>

        <Box display="flex" justifyContent="center">
          {loading ? (
            <Skeleton width={200} />
          ) : (
            <Button
              disabled={update}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              color="error"
              sx={{
                marginTop: 5,
                borderRadius: 2.5,
                height: 40,
                maxWidth: "fit-content",
              }}
            >
              Save Changes
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryDetails;
