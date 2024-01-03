import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import ErrorModal from "../common/ErrorModal";
import Header from "../common/Header";
import { getFeedbacks } from "./action";
import feedbacks from "../../constants/tables/feedbacks";
import Action from "../common/Action";

const ManageFeedbacks = () => {
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
          getFeedbacks({
            PageNumber: pageModelState.page,
            PageSize: pageModelState.pageSize,
            SearchBy: "userName",
            Search: search,
          })
        );
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: data.feedbacks.data,
          totalCount: data.feedbacks.totalCount,
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
  }, [search, pageModelState.page, pageModelState.pageSize]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onNavigate = (params) => {
    navigate("/feedbacks/details", { state: { feedbackId: params.row.id } });
  };

  const action = [
    {
      field: "action",
      headerName: "",
      width: 50,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <Action
            titleAc={"Are you sure you want to show?"}
            titleDe={"Are you sure you want to hide?"}
            messageAc={
              "Your action will display this user's comments for the tour or place."
            }
            messageDe={
              "Your action will hide this user's comments about the tour or place."
            }
            feedback={true}
            id={params.row.id}
            api="portal/places/feedback"
            status={params.row.status}
            getData={getData}
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
      {/* Title */}

      <ErrorModal
        open={notification.errorState}
        setOpen={setNotification}
        message={notification.errorMessage}
        status={notification.status}
      />
      <Header
        title={"Manage Feedbacks"}
        subTitle={"Manage all them existing feedbacks."}
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
            columns={feedbacks.concat(action)}
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

export default ManageFeedbacks;
