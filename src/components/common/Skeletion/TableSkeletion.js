import { Skeleton, TableCell, TableRow } from "@mui/material";
import React from "react";

const TableSkeletion = ({ rowsNum, columnsNum }) => {
  return [...Array(rowsNum)].map((row, index) => (
    <TableRow key={index}>
      {[...Array(columnsNum)].map((columnsNum, index) => (
        <TableCell key={index}>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default TableSkeletion;
