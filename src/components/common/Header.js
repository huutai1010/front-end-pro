import {
  Avatar,
  Box,
  Button,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

import { history } from "../AppRouter";
import SearchInput from "./toolsupports/SearchInput";
import FilterData from "./toolsupports/FilterData";

import { ArrowLeft } from "@styled-icons/bootstrap";
import { Add } from "@styled-icons/ionicons-solid";

const Header = ({
  title,
  subTitle,
  loading,
  showBack,
  showSearch,
  showFilter,
  buttonAdd,
  setOpen,
  search,
  setSearch,
  setSearchBy,
  isPlace,
}) => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      marginX={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        {showBack ? (
          !loading ? (
            <IconButton
              aria-label="back"
              sx={{ border: 1, color: theme.palette.text.buttonText }}
              onClick={() => history.back()}
            >
              <ArrowLeft width={20} />
            </IconButton>
          ) : (
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
          )
        ) : null}

        <Box>
          {!loading ? (
            <Typography
              color={theme.palette.text.active}
              fontWeight="bold"
              fontSize={28}
            >
              {title}
            </Typography>
          ) : (
            <Skeleton width={150} />
          )}
          {!loading ? (
            <Typography color={theme.palette.text.third} fontSize={16}>
              {subTitle}
            </Typography>
          ) : (
            <Skeleton width={250} />
          )}
        </Box>
      </Box>
      {/* Search Box*/}
      <Box display="flex" alignItems="center" gap={2}>
        {showSearch ? (
          !loading ? (
            <SearchInput search={search} setSearch={setSearch} />
          ) : (
            <Skeleton width={200} />
          )
        ) : null}
        {showFilter ? (
          !loading ? (
            <FilterData
              setSearchBy={setSearchBy}
              setSearch={setSearch}
              isPlace={isPlace}
            />
          ) : (
            <Skeleton width={200} />
          )
        ) : null}
        {buttonAdd ? (
          <Box>
            {!loading ? (
              <Button
                variant="contained"
                color="error"
                sx={{
                  borderRadius: 2.5,
                  height: 40,
                }}
                startIcon={<Add height={24} />}
                onClick={() => setOpen(true)}
              >
                <Typography fontWeight="medium">New</Typography>
              </Button>
            ) : (
              <Skeleton width={100} />
            )}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default Header;
