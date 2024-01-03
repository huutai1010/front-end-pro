import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { EyeOutline, EyeOffOutline } from "@styled-icons/evaicons-outline";
import { useDispatch } from "react-redux";
import { changePassword } from "../action";
import { useForm } from "react-hook-form";

const ChangePassword = ({
  update,
  setUpdate,
  notification,
  setNotification,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const [changePass, setChangePass] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = (e) => {
    setChangePass({ ...changePass, [e.target.name]: e.target.value });
  };

  const onChangePass = async () => {
    if (changePass.newPassword !== changePass.confirmPassword) {
      setError("newPassword", {
        message: "Password do not match!",
      });
      setError("confirmPassword", {
        message: "Password do not match!",
      });
    } else {
      setUpdate(true);
      try {
        await dispatch(changePassword(changePass));
        setUpdate(false);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Change password successfully!",
          status: "success",
        });
      } catch (e) {
        setUpdate(false);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: e.response.data?.message || "Change password failed!",
          status: "error",
        });
      }
    }
  };

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Box width={600} marginTop={2}>
        <Box marginLeft={1}>
          <Typography
            color={theme.palette.text.third}
            fontWeight="medium"
            marginBottom={1}
          >
            Old Password{" "}
            <small style={{ color: theme.palette.text.active }}>*</small>
          </Typography>
        </Box>
        <OutlinedInput
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((show) => !show)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                {showPassword ? (
                  <EyeOffOutline width={24} />
                ) : (
                  <EyeOutline width={24} />
                )}
              </IconButton>
            </InputAdornment>
          }
          fullWidth
          size="small"
          name="oldPassword"
          disabled={update}
          style={{ borderRadius: 10 }}
          {...register("oldPassword", {
            required: "Old Password is required!",
            validate: (value, formValue) => value.trim() !== "",
          })}
          onChange={handleChangePassword}
          error={!!errors.oldPassword}
        />
        <FormHelperText htmlFor="render-select" error>
          {errors.oldPassword?.message}
        </FormHelperText>
      </Box>
      <Box width={600} marginTop={2}>
        <Box marginLeft={1}>
          <Typography
            color={theme.palette.text.third}
            fontWeight="medium"
            marginBottom={1}
          >
            New Password{" "}
            <small style={{ color: theme.palette.text.active }}>*</small>
          </Typography>
        </Box>
        <OutlinedInput
          type={showNewPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowNewPassword((show) => !show)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                {showNewPassword ? (
                  <EyeOffOutline width={24} />
                ) : (
                  <EyeOutline width={24} />
                )}
              </IconButton>
            </InputAdornment>
          }
          fullWidth
          size="small"
          name="newPassword"
          disabled={update}
          style={{ borderRadius: 10 }}
          {...register("newPassword", {
            required: "New Password is required!",
            validate: (value, formValue) => value.trim() !== "",
          })}
          onChange={handleChangePassword}
          error={!!errors.newPassword}
        />
        <FormHelperText htmlFor="render-select" error>
          {errors.newPassword?.message}
        </FormHelperText>
      </Box>
      <Box width={600} marginTop={2}>
        <Box marginLeft={1}>
          <Typography
            color={theme.palette.text.third}
            fontWeight="medium"
            marginBottom={1}
          >
            Confirm Password{" "}
            <small style={{ color: theme.palette.text.active }}>*</small>
          </Typography>
        </Box>
        <OutlinedInput
          type={showConfirmPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowConfirmPassword((show) => !show)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                {showConfirmPassword ? (
                  <EyeOffOutline width={24} />
                ) : (
                  <EyeOutline width={24} />
                )}
              </IconButton>
            </InputAdornment>
          }
          fullWidth
          size="small"
          name="confirmPassword"
          disabled={update}
          style={{ borderRadius: 10 }}
          {...register("confirmPassword", {
            required: "Confirm Password is required!",
            validate: (value, formValue) => value.trim() !== "",
          })}
          onChange={handleChangePassword}
          error={!!errors.confirmPassword}
        />
        <FormHelperText htmlFor="render-select" error>
          {errors.confirmPassword?.message}
        </FormHelperText>
      </Box>
      <Box display="flex" justifyContent="center" marginTop={5}>
        <Button
          variant="contained"
          disabled={update}
          color="error"
          sx={{ borderRadius: 2.5 }}
          onClick={handleSubmit(onChangePass)}
        >
          Save Change
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;
