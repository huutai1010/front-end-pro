import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../common/Header";
import ErrorModal from "../common/ErrorModal";
import Action from "../common/Action";

import { getUsers } from "./action";
import users from "../../constants/tables/users";

const ManageUsers = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    totalCount: 0,
  });

  const [pageModelState, setPageModelState] = useState({
    page: 0,
    pageSize: 10,
  });

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const getData = useCallback(() => {
    async function fetchData() {
      try {
        setPageState((old) => ({
          ...old,
          isLoading: true,
        }));
        const data = await dispatch(
          getUsers({
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
    navigate("/users/details", { state: { accountId: params.row.id } });
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
        title={"Manage Users"}
        subTitle={"Manage all them existing users or update status."}
        showSearch={true}
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
            columns={users.concat(action)}
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
    </Box>
  );
};

export default ManageUsers;
