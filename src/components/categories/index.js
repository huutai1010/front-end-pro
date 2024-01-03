import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../common/Header";
import ErrorModal from "../common/ErrorModal";
import AddCategory from "../common/components/AddCategory";
import Action from "../common/Action";

import categories from "../../constants/tables/categories";
import { getCategories, processCategory } from "./action";
import { getAllLanguages } from "../languages/action";

const ManageCategories = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ name: "" });
  const [categoryLanguages, setCategoryLanguages] = useState([
    { languageCode: "zh-cn", nameLanguage: "" },
  ]);
  const [languageList, setLanguageList] = useState([]);
  const form = useForm({
    defaultValues: {
      name: "",
      categoryLanguages: [{ languageCode: "zh-cn", nameLanguage: "" }],
    },
  });

  const { register, handleSubmit, setError, clearErrors, formState } = form;
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

  useEffect(() => {
    async function fetchLanguage() {
      const response = await dispatch(getAllLanguages());
      setLanguageList(response.languages);
    }
    fetchLanguage();
  }, [dispatch]);

  const getData = useCallback(() => {
    async function fetchData() {
      try {
        setPageState((old) => ({
          ...old,
          isLoading: true,
        }));
        const data = await dispatch(
          getCategories({
            PageNumber: pageModelState.page,
            PageSize: pageModelState.pageSize,
            SearchBy: "fullName",
            Search: search,
          })
        );
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: data.categories.data,
          totalCount: data.categories.totalCount,
        }));
      } catch (error) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "There was a problem loading data categories!",
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

  const handleClose = () => {
    setOpen(false);
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

    if (categoryLanguages.some((item) => item.nameLanguage.trim() === "")) {
      return setError("nameLanguage", {
        message: "Language Name not empty!",
      });
    }
    const data = { ...values, categoryLanguages: categoryLanguages };
    try {
      setLoading(true);
      await dispatch(processCategory(data));
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Created category successfully!",
        status: "success",
      });
      setValues({ name: "" });
      setCategoryLanguages([{ languageCode: "zh-cn", nameLanguage: "" }]);
      setOpen(false);
      setLoading(false);
    } catch (e) {
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Create category failed!",
        status: "error",
      });
      setLoading(false);
    }
    getData();
  };

  const onNavigate = async (params) => {
    navigate("/categories/details", {
      state: { categoryId: params.row.id, languageList: languageList },
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
          <Action
            titleAc={"Confirm category activation?"}
            titleDe={"Confirm category deactivation?"}
            messageAc={
              "Activating category will allow users to perform activities with this category."
            }
            messageDe={
              "Deactivating category will cause this category to no longer be executed on the system."
            }
            id={params.row.id}
            api="portal/categories/changestatus"
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
        title={"Manage Categories"}
        subTitle={"Manage all existing categories or update status."}
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
            disableRowSelectionOnClick
            columns={categories.concat(action)}
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
              minHeight: "75vh",
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
          New Category
        </DialogTitle>
        <DialogContent sx={{ paddingX: 15, marginTop: 5 }}>
          <AddCategory
            values={values}
            loading={loading}
            setValues={setValues}
            categoryLanguages={categoryLanguages}
            setCategoryLanguages={setCategoryLanguages}
            languageList={languageList}
            register={register}
            errors={errors}
            clearErrors={clearErrors}
          />
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
            disabled={loading}
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
            disabled={loading}
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

export default ManageCategories;
