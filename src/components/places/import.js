import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
  alpha,
  Grid,
  FormHelperText,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import React, { useState } from "react";

import ErrorModal from "../common/ErrorModal";
import Header from "../common/Header";
import { useForm } from "react-hook-form";
import {
  FileEarmarkArrowUp,
  FiletypeMp3,
  FiletypePng,
  FiletypeExe,
} from "@styled-icons/bootstrap";

import { CloseOutline } from "@styled-icons/evaicons-outline";
import {
  CloudArrowUp,
  CloudCheckmark,
  CloudDismiss,
} from "styled-icons/fluentui-system-regular";
import {
  excelFileTypes,
  imageFileTypes,
  mp3FileTypes,
} from "../../constants/fileType";
import { importPlaceByFile } from "./action";
import { ExpandMore } from "styled-icons/material";

const ImportPlaces = () => {
  const theme = useTheme();

  const [excelFile, setExcelFile] = useState(null);
  const [importFile, setImportFile] = useState(false);
  const [imageFileList, setImageFileList] = useState([]);
  const [mp3FileList, setMp3FileList] = useState([]);
  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const {
    handleSubmit,
    clearErrors,
    resetField,
    setError,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { excelFile: null },
  });

  const handleChangeFile = (e) => {
    const filesList = Array.from(e.target.files);
    filesList.forEach((file) => {
      if (imageFileTypes.includes(file.type)) {
        setImageFileList((preImageList) => preImageList.concat(file));
      } else if (mp3FileTypes.includes(file.type)) {
        setMp3FileList((preMp3List) => preMp3List.concat(file));
      } else setError("errorFile", { message: "Please select file correct!" });
    });
  };

  const onSubmit = async () => {
    setImportFile(true);
    const data = imageFileList.concat(mp3FileList).concat(excelFile);
    try {
      const res = await importPlaceByFile(data);
      if (res) {
        setExcelFile(null);
        setImageFileList([]);
        setMp3FileList([]);
        setImportFile(false);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Import Place By File Successfully!",
          status: "success",
        });
      }
    } catch (e) {
      setImportFile(false);
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: e?.response?.data?.message || "Import Failed!",
        status: "error",
      });
    }
  };

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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={importFile}
      >
        <CircularProgress color="error" />
      </Backdrop>
      <Header
        title={"Import Place By Excel"}
        subTitle={"More Places - More Experiences - More Amenity"}
      />

      <Box paddingX={10} marginTop={5}>
        <Box>
          <Box marginLeft={1}>
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              Import excel file here
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item md={12} lg={6}>
              <Box
                display="flex"
                alignItems="center"
                border={1}
                borderRadius={2.5}
                borderColor={
                  errors.excelFile
                    ? theme.palette.text.active
                    : alpha(theme.palette.text.primary, 0.28)
                }
                height={40}
              >
                <label
                  htmlFor="excelFile"
                  style={{
                    display: "flex",
                    width: "100%",
                    color: theme.palette.text.third,
                    cursor: "pointer",
                  }}
                >
                  {excelFile ? (
                    <Box display="flex" alignItems="center">
                      {errors.excelFile ? (
                        <CloudDismiss
                          height={24}
                          color={theme.palette.text.active}
                          style={{ margin: 10 }}
                        />
                      ) : (
                        <CloudCheckmark
                          height={24}
                          color={theme.palette.text.onStatus}
                          style={{ margin: 10 }}
                        />
                      )}
                      <Typography noWrap>{excelFile?.name}</Typography>
                    </Box>
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      color={alpha(theme.palette.text.secondary, 0.4)}
                    >
                      <CloudArrowUp height={24} style={{ margin: 10 }} />
                      <Typography noWrap>Click to import excel file</Typography>
                    </Box>
                  )}

                  <input
                    id="excelFile"
                    type="file"
                    accept=".xlsx"
                    hidden
                    style={{
                      opacity: 0,
                      position: "absolute",
                    }}
                    {...register("excelFile", {
                      required: "Place select excel file!",
                      validate: (value) => {
                        return (
                          excelFileTypes.includes(value[0].type) ||
                          "Please select excel file!"
                        );
                      },
                      onChange: (e) => {
                        if (excelFileTypes.includes(e.target.files[0].type)) {
                          clearErrors("excelFile");
                          setExcelFile(e.target.files[0]);
                        }
                      },
                    })}
                  />
                </label>
              </Box>
              <FormHelperText
                htmlFor="render-select"
                error
                sx={{ marginLeft: 2 }}
              >
                {errors.excelFile?.message}
              </FormHelperText>
            </Grid>

            {excelFile ? (
              <Grid item md={12} lg={6}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                  borderRadius={5}
                  paddingLeft={2}
                  marginBottom={1}
                  bgcolor={alpha(theme.palette.text.onStatus, 0.2)}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    maxWidth={250}
                    marginRight={2}
                  >
                    <Box color={theme.palette.text.onStatus}>
                      <FiletypeExe width={20} />
                    </Box>
                    <Typography noWrap fontSize={14}>
                      {excelFile.name}
                    </Typography>
                  </Box>

                  <Box width={"60%"}>{/* <LinearProgress /> */}</Box>

                  <Box>
                    <IconButton
                      onClick={() => {
                        resetField("excelFile");
                        setExcelFile(null);
                      }}
                      sx={{ padding: 1 }}
                    >
                      <CloseOutline width={24} />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ) : null}
          </Grid>
        </Box>

        <Box marginTop={1}>
          <Box marginLeft={1}>
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              Import others files here
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item md={12} lg={6}>
              <Box
                htmlFor="upload"
                component="label"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  border: `1.5px dashed ${alpha(
                    theme.palette.text.primary,
                    0.28
                  )}`,
                  borderRadius: 2.5,
                  height: 300,
                  cursor: "pointer",
                  color: theme.palette.text.third,
                }}
              >
                <FileEarmarkArrowUp width={30} style={{ marginRight: 5 }} />
                <Typography>Click to upload...</Typography>
                <input
                  id="upload"
                  hidden
                  multiple
                  onChange={handleChangeFile}
                  type="file"
                  accept="image/jpeg, image/png, audio/mpeg, audio/mp3"
                />
              </Box>
            </Grid>

            <Grid item md={12} lg={6}>
              <Accordion sx={{ boxShadow: "none" }}>
                <AccordionSummary
                  expandIcon={<ExpandMore width={24} />}
                  sx={{
                    alignItems: "center",
                    bgcolor: theme.palette.background.primary,
                  }}
                >
                  <Typography
                    fontSize={14}
                    letterSpacing={0.5}
                    fontWeight="medium"
                    textTransform="uppercase"
                    color={theme.palette.text.third}
                  >
                    Image Files List ({imageFileList.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {imageFileList.map((file, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={1}
                      paddingLeft={2}
                      borderRadius={5}
                      marginBottom={1}
                      bgcolor={alpha(theme.palette.text.checked, 0.2)}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        maxWidth={250}
                        marginRight={2}
                      >
                        <Box color={theme.palette.text.checked}>
                          <FiletypePng width={20} />
                        </Box>
                        <Typography noWrap fontSize={14}>
                          {file.name}
                        </Typography>
                      </Box>
                      <Box width={"60%"}>{/* <LinearProgress /> */}</Box>
                      <Box>
                        <IconButton
                          onClick={(e) =>
                            setImageFileList(
                              imageFileList.filter((img, id) => id !== index)
                            )
                          }
                          sx={{ padding: 1 }}
                        >
                          <CloseOutline width={24} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ marginTop: 1, boxShadow: "none" }}>
                <AccordionSummary
                  expandIcon={<ExpandMore width={24} />}
                  sx={{
                    alignItems: "center",
                    bgcolor: theme.palette.background.primary,
                  }}
                >
                  <Typography
                    fontSize={14}
                    letterSpacing={0.5}
                    fontWeight="medium"
                    textTransform="uppercase"
                    color={theme.palette.text.third}
                  >
                    MP3 Files List ({mp3FileList.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {mp3FileList.map((file, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={1}
                      paddingLeft={2}
                      borderRadius={5}
                      marginBottom={1}
                      bgcolor={alpha(theme.palette.text.active, 0.2)}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        maxWidth={250}
                        marginRight={2}
                      >
                        <Box color={theme.palette.text.active}>
                          <FiletypeMp3 width={22} />
                        </Box>
                        <Typography noWrap fontSize={14}>
                          {file.name}
                        </Typography>
                      </Box>
                      <Box width={"60%"}>{/* <LinearProgress /> */}</Box>
                      <Box>
                        <IconButton
                          onClick={(e) =>
                            setMp3FileList(
                              mp3FileList.filter((mp3, id) => id !== index)
                            )
                          }
                          sx={{ padding: 1 }}
                        >
                          <CloseOutline width={24} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>

          <FormHelperText htmlFor="render-select" error sx={{ marginLeft: 2 }}>
            {errors.errorFile?.message}
          </FormHelperText>
        </Box>

        <Box display="flex" justifyContent="center" marginTop={5}>
          <Button
            color="error"
            variant="contained"
            sx={{ borderRadius: 2.5, width: 150 }}
            onClick={handleSubmit(onSubmit)}
          >
            Import File
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ImportPlaces;
