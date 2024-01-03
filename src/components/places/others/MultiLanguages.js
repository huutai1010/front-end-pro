import {
  Box,
  IconButton,
  Button,
  Divider,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React from "react";
import { Controller, useFieldArray } from "react-hook-form";

import { Add } from "@styled-icons/ionicons-outline";
import { Trash3 } from "@styled-icons/bootstrap";
import { CloudArrowUp } from "@styled-icons/fluentui-system-regular";
import {
  CloudCheckmark,
  CloudDismiss,
} from "@styled-icons/fluentui-system-filled";
const MultiLanguages = ({
  language,
  loading,
  register,
  control,
  getValues,
  errors,
}) => {
  const theme = useTheme();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "placeDescriptions",
  });
  const MAXIMUM_FILE_SIZE = 70 * 1024 * 1024;

  const hasDuplicate = () => {
    const formData = getValues();
    const languageCodes = new Set();
    for (const data of formData.placeDescriptions) {
      if (languageCodes.has(data.languageCode)) {
        return false;
      }
      languageCodes.add(data.languageCode);
    }

    return true;
  };

  const checkVoiceFile = () => {
    const formData = getValues();
    const languageCodes = new Set();
    for (const data of formData.placeDescriptions) {
      if (languageCodes.has(data.voiceFile?.name)) {
        return false;
      }
      if (data.voiceFile?.size > MAXIMUM_FILE_SIZE) {
        return false;
      }
      languageCodes.add(data.voiceFile?.name);
    }
    return true;
  };

  return (
    <Box padding={5} marginX={10}>
      {fields.map((item, index) => {
        return (
          <Box key={item.id} padding={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                fontWeight="medium"
                fontSize={18}
                color={alpha(theme.palette.text.primary, 0.75)}
              >
                Language Number {index + 1}
              </Typography>
              {fields.length === 1 ? null : (
                <IconButton
                  color="error"
                  onClick={() => remove(index)}
                  sx={{ marginLeft: 2 }}
                >
                  <Trash3 width={20} />
                </IconButton>
              )}
            </Box>
            <Box>
              <Grid container rowGap={2} marginY={2}>
                {/* Language*/}
                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <>
                    <Grid item sm={12} lg={3}>
                      <Typography color={theme.palette.text.third}>
                        Choose Language{" "}
                        <small style={{ color: theme.palette.text.active }}>
                          *
                        </small>
                      </Typography>
                    </Grid>
                    <Grid item sm={12} lg={9}>
                      <Controller
                        control={control}
                        name={`placeDescriptions[${index}].languageCode`}
                        rules={{
                          validate: () => {
                            return (
                              hasDuplicate() ||
                              "There are duplicate language. Please check again!"
                            );
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <Select
                              {...field}
                              defaultValue={""}
                              fullWidth
                              size="small"
                              sx={{
                                borderRadius: 2.5,
                              }}
                              error={!!error}
                            >
                              {language.map((item) => (
                                <MenuItem
                                  key={item.id}
                                  value={item.languageCode}
                                >
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
                  </>
                )}

                {/* Place Name */}
                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <>
                    <Grid item sm={12} lg={3}>
                      <Typography color={theme.palette.text.third}>
                        Place Name{" "}
                        <small style={{ color: theme.palette.text.active }}>
                          *
                        </small>
                      </Typography>
                    </Grid>
                    <Grid item sm={12} lg={9}>
                      <TextField
                        fullWidth
                        size="small"
                        InputProps={{
                          style: {
                            borderRadius: 10,
                          },
                        }}
                        {...register(`placeDescriptions.${index}.name`, {
                          validate: (value) => {
                            return (
                              value.trim() !== "" || "Place name is not empty!"
                            );
                          },
                          required: "Place Name is required!",
                        })}
                        error={!!errors.placeDescriptions?.[index]?.name}
                        helperText={
                          errors.placeDescriptions?.[index]?.name?.message
                        }
                        placeholder="Type place name here"
                      />
                    </Grid>
                  </>
                )}

                {/* Place Decription */}
                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <>
                    <Grid item sm={12} lg={3}>
                      <Typography color={theme.palette.text.third}>
                        Decription{" "}
                        <small style={{ color: theme.palette.text.active }}>
                          *
                        </small>
                      </Typography>
                      <Typography
                        fontSize={12}
                        color={theme.palette.text.third}
                      >
                        Write a short decription
                      </Typography>
                    </Grid>
                    <Grid item sm={12} lg={9}>
                      <TextField
                        fullWidth
                        rows={7}
                        multiline
                        size="small"
                        InputProps={{
                          style: {
                            borderRadius: 10,
                          },
                        }}
                        {...register(`placeDescriptions.${index}.description`, {
                          validate: (value) => {
                            return (
                              value.trim() !== "" || "Description is not empty!"
                            );
                          },
                          required: "Description is required!",
                        })}
                        error={!!errors.placeDescriptions?.[index]?.description}
                        helperText={
                          errors.placeDescriptions?.[index]?.description
                            ?.message
                        }
                        placeholder="Type description here"
                      />
                    </Grid>
                  </>
                )}

                {/* Place Voice File */}
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  <>
                    <Grid item sm={12} lg={3}>
                      <Typography color={theme.palette.text.third}>
                        Voice File{" "}
                        <small style={{ color: theme.palette.text.active }}>
                          *
                        </small>
                      </Typography>
                    </Grid>
                    <Grid item sm={12} lg={9}>
                      <Box
                        display="flex"
                        alignItems="center"
                        position="relative"
                        overflow="hidden"
                        width="100%"
                        border={1}
                        borderRadius={2.5}
                        borderColor={
                          errors.placeDescriptions?.[index]?.voiceFile
                            ? theme.palette.text.active
                            : alpha(theme.palette.text.primary, 0.28)
                        }
                        height={40}
                      >
                        <label
                          htmlFor={`placeDescriptions.${index}.voiceFile`}
                          style={{
                            display: "flex",
                            color: theme.palette.text.third,
                            cursor: "pointer",
                          }}
                        >
                          <Controller
                            name={`placeDescriptions.${index}.voiceFile`}
                            control={control}
                            rules={{
                              required: "Voice file is required!",
                              validate: () => {
                                return (
                                  checkVoiceFile() ||
                                  "This file name has been duplicated or this file size is larger than 70 MB!"
                                );
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                {field.value ? (
                                  <Box display="flex" alignItems="center">
                                    {!!!error ? (
                                      <CloudCheckmark
                                        height={24}
                                        color={theme.palette.text.onStatus}
                                        style={{ margin: 10 }}
                                      />
                                    ) : (
                                      <CloudDismiss
                                        height={24}
                                        color={theme.palette.text.active}
                                        style={{ margin: 10 }}
                                      />
                                    )}
                                    <Typography noWrap>
                                      {field.value?.name}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    color={alpha(theme.palette.text.third, 0.5)}
                                  >
                                    <CloudArrowUp
                                      height={24}
                                      style={{ margin: 10 }}
                                    />
                                    <Typography noWrap>
                                      Click to import file...
                                    </Typography>
                                  </Box>
                                )}

                                <input
                                  id={`placeDescriptions.${index}.voiceFile`}
                                  type="file"
                                  style={{
                                    opacity: 0,
                                    position: "absolute",
                                  }}
                                  hidden
                                  onChange={(e) =>
                                    field.onChange(e.target.files[0])
                                  }
                                  accept="audio/mpeg, audio/mp3"
                                />
                              </>
                            )}
                          />
                        </label>
                      </Box>
                      <FormHelperText
                        htmlFor="render-select"
                        error
                        sx={{ marginLeft: 2 }}
                      >
                        {errors.placeDescriptions?.[index]?.voiceFile?.message}
                      </FormHelperText>
                    </Grid>
                  </>
                )}
              </Grid>
              <Divider />
            </Box>
          </Box>
        );
      })}

      <Box marginTop={2} display="flex" justifyContent="center">
        {fields.length < language.length ? (
          loading ? (
            <Skeleton width={200} />
          ) : (
            <Button
              onClick={() => {
                if (fields.length < language.length) {
                  append({
                    languageCode: "en-us",
                    name: "",
                    description: "",
                    voiceFile: null,
                  });
                }
              }}
              sx={{ borderRadius: 2.5 }}
            >
              <Add width={20} />
              <Typography fontWeight="medium" fontSize={14}>
                New Language
              </Typography>
            </Button>
          )
        ) : null}
      </Box>
    </Box>
  );
};

export default MultiLanguages;
