import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import Header from "../common/Header";
import ErrorModal from "../common/ErrorModal";
import Action from "../common/Action";

import staffs from "../../constants/tables/staffs";
import { getStaffs, processStaff } from "./action";
import CustomNoRowsOverlay from "../common/CustomNoRowsOverlay";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  roleId: 2,
};

const ManageStaffs = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialState);

  const form = useForm({ defaultValues: initialState });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    totalCount: 0,
  });

  const [pageModelState, setPageModelState] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const getData = useCallback(() => {
    async function fetchData() {
      try {
        setPageState((old) => ({
          ...old,
          isLoading: true,
        }));
        const data = await dispatch(
          getStaffs({
            PageNumber: pageModelState.page,
            PageSize: pageModelState.pageSize,
            SearchBy: "fullName",
            Search: search,
          })
        );
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: data.accounts.data,
          totalCount: data.accounts.totalCount,
        }));
      } catch (error) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "There was a problem loading data accounts!",
          status: "error",
        });
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, pageModelState.page, pageModelState.pageSize]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onNavigate = async (params) => {
    navigate("/moderators/details", { state: { accountId: params.row.id } });
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = async () => {
    try {
      await dispatch(processStaff(values));
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Created moderator successfully!",
        status: "success",
      });

      setValues(initialState);
      setOpen(false);
    } catch (e) {
      const message = e.response.data ? e.response.data.message : e.message;
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: message,
        status: "error",
      });
    }
    getData();
  };

  const action = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <Action
            titleAc={"Confirm account activation?"}
            titleDe={"Confirm account deactivation?"}
            messageAc={
              "Activating account will allow this account to perform activities under its authority."
            }
            messageDe={
              "Deactivating account will make this account no longer active in the system."
            }
            id={params.row.id}
            api="portal/users"
            getData={getData}
            status={params.row.status}
            notification={notification}
            setNotification={setNotification}
          />
        );
      },
    },
  ];

  return (
    <Box
      minHeight="94vh"
      margin="1.25em"
      padding={2}
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
        title={"Manage Moderators"}
        subTitle={"Manage all available moderators."}
        showSearch={true}
        buttonAdd={true}
        setOpen={setOpen}
        search={search}
        setSearch={setSearch}
      />

      {/* Data Table */}
      <Grid container paddingX={2} marginTop={3} width="99%">
        <Grid item xs={12}>
          <DataGrid
            autoHeight
            disableColumnMenu
            disableRowSelectionOnClick
            columns={staffs.concat(action)}
            rows={pageState.data}
            rowCount={pageState.totalCount}
            loading={pageState.isLoading}
            paginationModel={pageModelState}
            pageSizeOptions={[5, 10, 20]}
            paginationMode="server"
            onPaginationModelChange={setPageModelState}
            onRowClick={(params) => onNavigate(params)}
            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
            sx={{
              border: 0,
              minHeight: "75vh",
              "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "--DataGrid-overlayHeight": "300px",
            }}
          />
        </Grid>
      </Grid>

      {/* Modal New Staff */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
        PaperProps={{ sx: { borderRadius: 5 } }}
      >
        <DialogTitle
          textAlign="center"
          color="error"
          fontWeight="bold"
          fontSize={26}
          borderBottom={1}
          borderColor={theme.palette.background.third}
        >
          New Moderator
        </DialogTitle>
        <DialogContent sx={{ paddingX: 15, marginTop: 5 }}>
          <form noValidate>
            <Grid container columnSpacing={5} rowSpacing={2}>
              <Grid item sm={12} md={6}>
                <Box marginLeft={1}>
                  <Typography>First Name</Typography>
                </Box>
                <TextField
                  fullWidth
                  autoFocus
                  name="firstName"
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  value={values.firstName}
                  {...register("firstName", {
                    validate: (value, formValues) => value.trim() !== "",
                    required: "First Name is required!",
                  })}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <Box marginLeft={1}>
                  <Typography>Last Name</Typography>
                </Box>
                <TextField
                  fullWidth
                  name="lastName"
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  value={values.lastName}
                  {...register("lastName", {
                    validate: (value, formValues) => value.trim() !== "",
                    required: "Last Name is required!",
                  })}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <Box marginLeft={1}>
                  <Typography>Phone</Typography>
                </Box>
                <TextField
                  fullWidth
                  name="phone"
                  type="tel"
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  value={values.phone}
                  {...register("phone", {
                    validate: (value, formValues) => value.trim() !== "",
                    required: "Phone Number is required!",
                  })}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <Box marginLeft={1}>
                  <Typography>Email</Typography>
                </Box>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  size="small"
                  required
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  value={values.email}
                  {...register("email", {
                    required: "Email is required!",
                    validate: (value, formValues) => value.trim() !== "",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email is wrong format!",
                    },
                  })}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={
                    !errors.email
                      ? '"Login with the character before @"'
                      : errors.email?.message
                  }
                />
              </Grid>
              <Grid item sm={12}>
                <Box marginLeft={1}>
                  <Typography>Password</Typography>
                </Box>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  value={values.password}
                  {...register("password", {
                    validate: (value, formValues) => value.trim() !== "",
                    required: "Password is required!",
                  })}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid item sm={12}>
                <Box marginLeft={1}>
                  <Typography>Role</Typography>
                </Box>
                <FormControl
                  sx={{
                    minWidth: 120,
                  }}
                  fullWidth
                  size="small"
                >
                  <Select
                    value={values.roleId}
                    sx={{ borderRadius: 2.5 }}
                    name="roleId"
                    onChange={handleChange}
                  >
                    <MenuItem value={2} defaultValue>
                      Moderator
                    </MenuItem>
                    <MenuItem value={1}>Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions
          sx={{
            paddingBottom: 5,
            "&.MuiDialogActions-root": { justifyContent: "center" },
          }}
        >
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            sx={{
              borderRadius: 2.5,
              height: 40,
            }}
          >
            Add New
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2.5,
              height: 40,
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageStaffs;
