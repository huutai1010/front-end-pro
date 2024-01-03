import {
  Box,
  FormHelperText,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React from "react";
import {
  CloudCheckmark,
  CloudDismiss,
} from "@styled-icons/fluentui-system-filled";
import { CloudArrowUp } from "@styled-icons/fluentui-system-regular";
import { imageFileTypes } from "../../constants/fileType";

const UploadImage = ({ values, setValues, errors, register, disabled }) => {
  const theme = useTheme();

  const previewImage = (data) => {
    if (data instanceof File && imageFileTypes.includes(data.type)) {
      return URL.createObjectURL(data);
    }
    return data;
  };
  return (
    <Box width="100%">
      <Box
        display="flex"
        alignItems="center"
        position="relative"
        overflow="hidden"
        border={1}
        borderRadius={2.5}
        borderColor={
          errors.image
            ? theme.palette.text.active
            : alpha(theme.palette.text.primary, 0.28)
        }
        height={40}
      >
        <label
          htmlFor="image"
          style={{
            display: "flex",
            width: "100%",
            color: theme.palette.text.third,
            cursor: "pointer",
          }}
        >
          {values.image ? (
            <Box display="flex" alignItems="center">
              {errors.image ? (
                <CloudDismiss
                  height={24}
                  color={theme.palette.text.active}
                  style={{ margin: 10 }}
                />
              ) : (
                <CloudCheckmark
                  height={24}
                  color={theme.palette.text.onStatus}
                  style={{ margin: 10 }}
                />
              )}
              <Typography noWrap>
                {values.image instanceof File
                  ? values.image.name
                  : "Image is uploaded..."}
              </Typography>
            </Box>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              color={alpha(theme.palette.text.secondary, 0.4)}
            >
              <CloudArrowUp height={24} style={{ margin: 10 }} />
              <Typography noWrap>Import image for itinerary here</Typography>
            </Box>
          )}

          <input
            id="image"
            name="image"
            type="file"
            disabled={disabled}
            accept="image/jpeg, image/png"
            style={{
              opacity: 0,
              position: "absolute",
            }}
            {...register("image", {
              required: values.image ? false : "Image is required!",
              validate: (value) => {
                if (value.length === 1)
                  return (
                    imageFileTypes.includes(value[0].type) ||
                    "Images must be in PNG or JPG format!"
                  );
              },
              onChange: (e) => {
                setValues({ ...values, image: e.target.files[0] });
              },
            })}
          />
        </label>
      </Box>
      <FormHelperText htmlFor="render-select" error sx={{ marginLeft: 2 }}>
        {errors.image?.message}
      </FormHelperText>
      <Box marginTop={2}>
        <img
          src={previewImage(values.image)}
          style={{
            borderRadius: 10,
            maxWidth: "100%",
            maxHeight: 300,
          }}
          alt=""
        />
      </Box>
    </Box>
  );
};

export default UploadImage;
