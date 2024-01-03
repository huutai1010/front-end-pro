import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import SubCard from "./SubCard";
import subPlaces from "../../../constants/tables/subPlaces";

import { FilterAlt } from "@styled-icons/boxicons-regular";
import { Search } from "@styled-icons/evaicons-solid";
import { AddCircle, MoreCircle } from "@styled-icons/fluentui-system-regular";
import { CheckCircleFill } from "@styled-icons/bootstrap";
import { DataGrid } from "@mui/x-data-grid";

const PlacesList = ({
  values,
  setValues,
  setSearch,
  setSearchBy,
  errors,
  setError,
  clearErrors,
  pageState,
  setPageState,
  pageModelState,
  setPageModelState,
  notification,
  setNotification,
}) => {
  const theme = useTheme();
  const [placesList, setPlacesList] = useState(values?.tourDetails);
  const [price, setPrice] = useState(values?.total);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (placesList.length < 2) {
      setError("minimumPlace", {
        message: `(Please select at least ${
          2 - placesList.length
        } additional places to continue.)`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesList]);

  useEffect(() => {
    setValues({ ...values, tourDetails: placesList, total: price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesList]);

  useEffect(() => {
    setPageState({ ...pageState, data: [...pageState.data] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    if (event.target.value === "") {
      setSearchBy("");
      setSearch(event.target.value);
    } else if (["Travel", "Food"].includes(event.target.value)) {
      setSearchBy("category");
      setSearch(event.target.value);
    }
    setFilterValue(event.target.value);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(placesList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPlacesList(items);
  };

  const isDuplicate = (data) => {
    let checkDuplicate = false;
    for (const place of placesList) {
      if (place.id === data.id) {
        checkDuplicate = true;
        break;
      }
    }
    return checkDuplicate;
  };

  const onAdd = (data) => {
    if (!isDuplicate(data)) {
      clearErrors("minimumPlace");
      setPlacesList(placesList.concat([data]));
      setPrice(price + data.price);
    } else {
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "This place has been added to the list!",
        status: "error",
      });
    }
  };

  const action = [
    {
      field: "action",
      headerName: "Action",
      width: 80,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton aria-label="add" onClick={(e) => onAdd(params.row)}>
              {!isDuplicate(params.row) ? (
                <AddCircle width={24} color={theme.palette.text.active} />
              ) : (
                <CheckCircleFill
                  width={24}
                  color={theme.palette.text.onStatus}
                />
              )}
            </IconButton>
            <IconButton aria-label="more" onClick={(e) => {}}>
              <MoreCircle width={24} />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <Box width="100%" paddingX={3} marginTop={2}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={7}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={3}
          >
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search width={24} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 10,
                },
              }}
              size="small"
              fullWidth
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchBy("name");
              }}
              placeholder="Search by name..."
            />
            <FormControl size="small" sx={{ m: 1, minWidth: 200 }}>
              <Select
                value={filterValue}
                onChange={handleChange}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <FilterAlt height={24} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2.5,
                }}
              >
                <MenuItem value="" selected>
                  All
                </MenuItem>
                <ListSubheader>Category</ListSubheader>
                <MenuItem value="Travel">Travel</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                {/* <ListSubheader>Language</ListSubheader>
                <MenuItem value={3}>Option 3</MenuItem>
                <MenuItem value={4}>Option 4</MenuItem> */}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <DataGrid
              columns={subPlaces.concat(action)}
              rows={pageState.data}
              rowCount={pageState.totalCount}
              loading={pageState.isLoading}
              pageSizeOptions={[10]}
              paginationModel={pageModelState}
              paginationMode="server"
              onPaginationModelChange={setPageModelState}
              disableColumnMenu
              disableRowSelectionOnClick
              sx={{
                border: 0,
                "& .MuiDataGrid-row:hover": {
                  cursor: "pointer",
                },
                ".MuiDataGrid-cell:focus": {
                  outline: "none",
                },
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6" fontWeight="semiBold">
                Reorder columns
              </Typography>
              <Box
                height={23}
                width={23}
                textAlign="center"
                bgcolor={theme.palette.background.hovered}
                color={theme.palette.text.second}
                borderRadius={2}
              >
                <Typography variant="span" fontWeight="medium">
                  {placesList.length}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body1"
              fontWeight="regular"
              color={theme.palette.text.third}
            >
              Click and drag to reorder the columns
            </Typography>
          </Box>

          <Box>
            <Box minHeight={300} marginTop={5}>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="ROOT" type="group">
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      {placesList.map((place, index) => (
                        <Draggable
                          key={place.id}
                          draggableId={place.name}
                          index={index}
                        >
                          {(provided) => (
                            <SubCard
                              provided={provided}
                              place={place}
                              placesList={placesList}
                              setPlacesList={setPlacesList}
                              price={price}
                              setPrice={setPrice}
                            />
                          )}
                        </Draggable>
                      ))}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
              {placesList.length < 2 ? (
                <Box display="flex" justifyContent="center">
                  <Typography color="error" fontWeight="medium" fontSize={14}>
                    {errors?.minimumPlace?.message}
                  </Typography>
                </Box>
              ) : null}
            </Box>

            <Box display="flex" justifyContent="space-between" marginTop={5}>
              <Typography fontSize={18} fontWeight="semiBold">
                Total Price :
              </Typography>
              <Typography fontSize={18} fontWeight="semiBold">
                {price.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} $
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlacesList;
