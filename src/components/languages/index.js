import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Header from "../common/Header";
import UploadFile from "../common/UploadFile";
import ErrorModal from "../common/ErrorModal";

import { getLanguageCode, getLanguages, processLanguage } from "./action";
import languages from "../../constants/tables/languages";
import ActionLanguage from "../common/ActionLanguage";

const ManageLanguages = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [languageCode, setLanguageCode] = useState([]);
  const [values, setValues] = useState({
    name: "",
    icon: "",
    languageCode: "",
  });
  const [file, setFile] = useState();
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

  const form = useForm({
    defaultValues: {
      name: "",
      icon: "",
      languageCode: "",
    },
  });
  const { handleSubmit, setError, clearErrors, formState } = form;
  const { errors } = formState;

  const getData = useCallback(() => {
    async function fetchData() {
      setPageState((old) => ({
        ...old,
        isLoading: true,
      }));
      try {
        const data = await dispatch(
          getLanguages({
            PageNumber: pageModelState.page,
            PageSize: pageModelState.pageSize,
            SearchBy: "fullName",
            search: search,
          })
        );
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: data.languages.data,
          totalCount: data.languages.totalCount,
        }));
      } catch (error) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "There was a problem loading data!",
          status: "error",
        });
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, pageModelState.page, pageModelState.pageSize]);

  useEffect(() => {
    if (languageCode.length > 0) {
      return;
    }
    async function fetchData() {
      try {
        const res = await getLanguageCode();
        setLanguageCode(res);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getData]);

  const handleChange = (event) => {
    clearErrors("values");
    setValues({
      ...values,
      name: event?.target.value.languageName,
      icon: event?.target.value.icon,
      languageCode: event?.target.value.nationalCode,
    });
  };

  const onSubmit = async () => {
    if (values.name === "") {
      return setError("values", {
        message: "Choose language!",
      });
    }
    if (!file) {
      return setError("fileType", {
        message: "Must import a JSON file!",
      });
    } else if (file.type !== "application/json") {
      return setError("fileType", {
        message: "Only JSON file are allowed!",
      });
    } else if (file.name?.split(".")[0] !== values.languageCode) {
      return setError("fileType", {
        message: "File name must same language code!",
      });
    }

    const data = { ...values, fileLink: file };
    try {
      setLoading(true);
      await dispatch(processLanguage(data));
      await setLoading(false);
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Created language successfully!",
        status: "success",
      });

      setOpen(false);
    } catch (e) {
      setLoading(false);
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: e.response.data.message || "Created language failed!",
        status: "error",
      });
    }
    getData();
  };

  const handleClose = () => {
    clearErrors("values, fileType");
    setOpen(false);
    setValues({
      name: "",
      icon: "",
      languageCode: "",
    });
    setFile();
  };

  const onNavigate = async (params) => {
    navigate("/languages/details", {
      state: { languageId: params.row.id, languageCode: languageCode },
    });
  };

  const action = [
    {
      field: "action",
      headerName: "Actions",
      width: 80,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <ActionLanguage
            id={params.row.id}
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
      minWidth="94vh"
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
        title={"Manage Languages"}
        subTitle={"Manage all them existing languages or update status."}
        showSearch={true}
        search={search}
        setSearch={setSearch}
        buttonAdd={true}
        setOpen={setOpen}
      />

      {/* Data Table */}
      <Grid container paddingX={2} marginTop={3} width="99%">
        <Grid item xs={12}>
          <DataGrid
            autoHeight
            disableColumnMenu
            rowHeight={75}
            disableRowSelectionOnClick
            columns={languages.concat(action)}
            rows={pageState.data}
            rowCount={pageState.totalCount}
            loading={pageState.isLoading}
            paginationModel={pageModelState}
            pageSizeOptions={[5, 10, 20]}
            paginationMode="server"
            onPaginationModelChange={setPageModelState}
            onRowClick={(params) => onNavigate(params)}
            sx={{
              border: 0,
              minHeight: "77vh",
              "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </Grid>
      </Grid>

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
          New Languages
        </DialogTitle>
        <DialogContent sx={{ paddingX: 20, marginTop: 5 }}>
          <Grid container spacing={2}>
            <Grid item lg={4}>
              <Typography>Language Name</Typography>
            </Grid>
            <Grid item lg={8}>
              <FormControl fullWidth size="small" noValidate>
                <Select
                  sx={{ borderRadius: 2.5 }}
                  name="values"
                  fullWidth
                  defaultValue=""
                  disabled={loading}
                  onChange={handleChange}
                  error={!!errors?.values}
                >
                  {languageCode.map((item, index) => (
                    <MenuItem key={index} value={item || ""}>
                      <img
                        src={item.icon}
                        alt={item.nationalName}
                        style={{ width: 20, marginRight: 10 }}
                      />
                      {item.nationalName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText htmlFor="render-select" error>
                  {errors.values?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item lg={4}>
              <Typography>Language Code</Typography>
            </Grid>
            <Grid item lg={8}>
              <TextField
                fullWidth
                size="small"
                name="nationalCode"
                disabled
                InputProps={{
                  style: {
                    borderRadius: 10,
                  },
                }}
                value={values?.languageCode}
              />
            </Grid>
            <Grid item lg={4}>
              <Typography>File</Typography>
            </Grid>
            <Grid item lg={8}>
              <UploadFile
                disabled={loading}
                file={file}
                setFile={setFile}
                clearErrors={clearErrors}
              />
              <FormHelperText htmlFor="render-select" error>
                {errors.fileType?.message}
              </FormHelperText>
            </Grid>
          </Grid>

          <Box marginTop={2} color={theme.palette.text.third}>
            <Typography fontWeight="semiBold">Note</Typography>
            <ul style={{ marginLeft: 20 }}>
              <li style={{ fontSize: 14 }}>The file must be a json file.</li>
              <li style={{ fontSize: 14 }}>
                The file name must same language code.
              </li>
              <li style={{ fontSize: 14 }}>
                Get data template file{" "}
                <Link to={"/template.json"} download>
                  here
                </Link>
                .
              </li>
            </ul>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            paddingBottom: 5,
            "&.MuiDialogActions-root": { justifyContent: "center" },
          }}
        >
          <Button
            disabled={loading}
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
            disabled={loading}
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

export default ManageLanguages;
