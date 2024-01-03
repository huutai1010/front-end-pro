import { Box } from "@mui/material";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";

import beacons from "../../../../constants/tables/beacons";
import CustomNoRowsOverlay from "../../../common/CustomNoRowsOverlay";

const BeaconSub = ({ values, loading, setDialog, setBeaconId }) => {
  return (
    <Box width="99.5%">
      <DataGrid
        rowHeight={80}
        autoHeight
        disableColumnMenu
        disableRowSelectionOnClick
        columns={beacons}
        rows={values}
        loading={loading}
        onRowClick={(params) => {
          setBeaconId(params.id);
          setDialog(true);
        }}
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        sx={{
          border: 0,
          minHeight: "55vh",
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "--DataGrid-overlayHeight": "300px",
        }}
      />
    </Box>
  );
};

export default BeaconSub;
