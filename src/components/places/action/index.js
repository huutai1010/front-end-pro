import {
  API,
  convertVoiceFile,
  fetch,
  process,
  uploadFile,
} from "../../../api";

export const SET_PLACES_STATE = "SET_PLACES_STATE";

export const ADD_TOUR = "ADD_TOUR";

const setState = (state) => ({
  type: SET_PLACES_STATE,
  state,
});

export const getPlaces = (payload) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().places,
      dispatch,
      setState,
      "portal/places",
      payload
    );
  };
};

export const getPlaceDetails = async (placeId) => {
  try {
    const { data } = await API.get(`portal/places/${placeId}`);
    return Promise.resolve(data.place);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const processPlace = (newPlace, files) => {
  return async (dispatch, getState) => {
    return process(
      getState().places,
      dispatch,
      setState,
      "portal/places",
      newPlace,
      files
    );
  };
};

export const updatePlace = async (placeId, values, files) => {
  try {
    setState({ isFetching: true });

    //Upload image place
    if (values.placeImages) {
      let formData = new FormData();
      values.placeImages.forEach((img) => {
        if (img.image instanceof File) {
          formData.append("file", img.image);
        }
      });

      // Check if formData has data before calling uploadFile
      if (formData && formData.getAll && formData.getAll("file").length > 0) {
        const { data } = await uploadFile(
          formData,
          `place/PlaceImg/${values.name}`
        );
        data.imageFiles.forEach((itm) => {
          const indexItem = values.placeImages.findIndex(
            (file) => itm.fileName === file.image.name
          );
          if (indexItem !== -1) {
            values.placeImages[indexItem].image = itm.fileLink;
          }
        });
      }
    }

    //Upload image beacon
    if (values.placeItems && values.placeItems.length > 0) {
      let formData = new FormData();
      values.placeItems.forEach((beacon) => {
        if (beacon.image instanceof File) {
          formData.append("file", beacon.image);
        }
      });

      // Check if formData has data before calling uploadFile
      if (formData && formData.getAll && formData.getAll("file").length > 0) {
        const { data } = await uploadFile(
          formData,
          `place/PlaceItemImg/${values.name}`
        );
        data.imageFiles.forEach((itm) => {
          const indexItem = values.placeItems.findIndex(
            (file) => itm.fileName === file.image.name
          );
          if (indexItem !== -1) {
            values.placeItems[indexItem].image = itm.fileLink;
          }
        });
      }
    }

    //Convert voice file
    let formData = new FormData();
    if (files) {
      files.forEach((item) => {
        if (item.voiceFile instanceof File) {
          formData.append("listMp3", item.voiceFile);
        }
      });
    }

    const { data } = await API.put(`portal/places/${placeId}`, values);

    // Check if formData has data before calling convertVoiceFile
    if (formData && formData.getAll && formData.getAll("listMp3").length > 0)
      await convertVoiceFile(formData);

    setState({ isFetching: false });
    return await Promise.resolve(data);
  } catch (e) {
    setState({ isFetching: false });
    return Promise.reject(e);
  }
};

export const importPlaceByFile = async (dataList) => {
  try {
    setState({ isFetching: true });
    let formData = new FormData();
    dataList.forEach((element) => {
      formData.append("fileList", element);
    });

    const { data } = await API.post(`portal/places/importexcel`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setState({ isFetching: false });
    return Promise.resolve(data);
  } catch (e) {
    setState({ isFetching: false });
    return Promise.reject(e);
  }
};

export const getPlaceComments = async (placeId) => {
  try {
    const { data } = await API.get(`portal/feedbacks/${placeId}`, {
      params: { isPlace: true },
    });
    return Promise.resolve(data.feedbacks);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getPlaceItem = async (itemId) => {
  try {
    const { data } = await API.get(`portal/places/placeitem/${itemId}`);
    return Promise.resolve(data.placeItem);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updatePlaceItem = async (locationId, values) => {
  try {
    setState({ isFetching: true });

    if (values.image instanceof File) {
      let formData = new FormData();
      formData.append("file", values.image);
      const { data } = await uploadFile(
        formData,
        `place/PlaceItemImg/${values.name}`
      );
      values.image = data.imageFiles[0].fileLink;
    }

    const { data } = await API.put(
      `portal/places/placeitem/${locationId}`,
      values
    );

    setState({ isFetching: false });
    return Promise.resolve(data);
  } catch (e) {
    setState({ isFetching: false });
    return Promise.reject(e);
  }
};

export const changePlaceState = async (tourId, status) => {
  try {
    const { data } = await API.put(
      `portal/places/changestatus/${tourId}`,
      null,
      {
        params: { status: status },
      }
    );
    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
};
