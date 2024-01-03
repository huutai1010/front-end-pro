import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import ErrorModal from "../common/ErrorModal";
import Header from "../common/Header";
import { getBookings } from "./action";
import bookings from "../../constants/tables/bookings";
import CustomNoRowsOverlay from "../common/CustomNoRowsOverlay";

const ManageBookings = () => {
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
          getBookings({
            PageNumber: pageModelState.page,
            PageSize: pageModelState.pageSize,
            SearchBy: "customerName",
            Search: search,
          })
        );
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: data.bookings.data,
          totalCount: data.bookings.totalCount,
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
    navigate("/bookings/details", { state: { bookingId: params.row.id } });
  };

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
        title={"Manage Bookings"}
        subTitle={"Manage all existing bookings in the system"}
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
            columns={bookings}
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
    </Box>
  );
};

export default ManageBookings;
