import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const GOONG_MAPTILES_KEY = "foAIsmKSYDQOdkoRfIj1T1MbkKaIIq5vvwSXb50U";
export const GOONG_API_KEY = "lufMpKjvYBPBQqq13Zwl0vTLnPUHtkksPTV1YcEs";
export const GOOGLE_API_KEY = "AIzaSyCc_mGTPxKtDmD5HcOu1dw5vG0fFkuKROA";

// URL
const GOOGLE_TRANSLATE_API =
  "https://translation.googleapis.com/language/translate/v2";
export const GOONG_URL = "https://rsapi.goong.io/Place/AutoComplete";

// export const BASE_URL = "http://localhost:8000";
export const BASE_URL = "https://etravelapi.azurewebsites.net";

export const API = axios.create({
  baseURL: `${BASE_URL}/api/`,
});

API.interceptors.request.use(function (config) {
  const token = cookies.get("profile").accessToken;
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export const convertVoiceFile = (item) => {
  return API.post("portal/assets/convert/mp3", item, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const removeVoiceFile = (name) => {
  return API.delete("portal/assets/fileName", {
    params: { fileName: name },
  });
};

export const uploadFile = (files, path) => {
  return API.post(
    "/portal/assets/image",
    files,
    { params: { imagePath: path } },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const removeFile = (path, name) => {
  return API.delete("portal/assets/image", {
    params: { imagePath: path, imageName: name },
  });
};

export const fetch = async (state, dispatch, setState, path, payload) => {
  if (state.isFetching) {
    return Promise.resolve(state.items);
  }

  try {
    dispatch(setState({ isFetching: true }));
    const { data } = await API.get(path, { params: payload });
    dispatch(setState({ isFetching: false, items: data }));
    return Promise.resolve(data);
  } catch (e) {
    dispatch(setState({ isFetching: false }));
    return Promise.reject(e);
  }
};

export const process = async (state, dispatch, setState, path, item, files) => {
  if (state.isFetching) {
    return Promise.reject(new Error("This item is being processed."));
  }

  try {
    dispatch(setState({ isFetching: true }));

    //Upload image place
    if (item.placeImages) {
      let formData = new FormData();
      item.placeImages.forEach((img) => {
        if (img.image instanceof File) {
          formData.append("file", img.image);
        }
      });

      // Check if formData has data before calling uploadFile
      if (formData && formData.getAll && formData.getAll("file").length > 0) {
        const { data } = await uploadFile(
          formData,
          `place/PlaceImg/${item.name}`
        );
        data.imageFiles.forEach((itm) => {
          const indexItem = item.placeImages.findIndex(
            (file) => itm.fileName === file.image.name
          );
          if (indexItem !== -1) {
            item.placeImages[indexItem].image = itm.fileLink;
          }
        });
      }
    }

    //Upload image beacon
    if (item.placeItems && item.placeItems.length > 0) {
      let formData = new FormData();
      item.placeItems.forEach((beacon) => {
        if (beacon.image instanceof File) {
          formData.append("file", beacon.image);
        }
      });

      // Check if formData has data before calling uploadFile
      if (formData && formData.getAll && formData.getAll("file").length > 0) {
        const { data } = await uploadFile(
          formData,
          `place/PlaceItemImg/${item.name}`
        );
        data.imageFiles.forEach((itm) => {
          const indexItem = item.placeItems.findIndex(
            (file) => itm.fileName === file.image.name
          );
          if (indexItem !== -1) {
            item.placeItems[indexItem].image = itm.fileLink;
          }
        });
      }
    }

    //Upload image tour
    if (item.image instanceof File) {
      let formData = new FormData();
      formData.append("file", item.image);
      const { data } = await uploadFile(formData, "Tour");
      item.image = data.imageFiles[0].fileLink;
    }

    //Upload language file
    if (item.fileLink instanceof File) {
      let formData = new FormData();
      formData.append("file", item.fileLink);

      const { data } = await uploadFile(formData, "Language/FileTranslate");
      item.fileLink = data.link;
    }

    await API.post(path, item);

    //Convert voice file
    if (files) {
      let formData = new FormData();
      files.forEach((file) => {
        if (file.voiceFile instanceof File) {
          formData.append("listMp3", file.voiceFile);
        }
      });

      // Check if formData has data before calling convertVoiceFile
      if (formData && formData.getAll && formData.getAll("listMp3").length > 0)
        await convertVoiceFile(formData);
    }
    dispatch(setState({ isFetching: false }));
    return Promise.resolve();
  } catch (e) {
    dispatch(setState({ isFetching: false }));
    return Promise.reject(e);
  }
};

export const translate = async (item) => {
  try {
    const { data } = await axios.post(
      GOOGLE_TRANSLATE_API,
      { q: item, target: "en", format: "text" },
      {
        headers: {
          "X-goog-api-key": GOOGLE_API_KEY,
        },
      }
    );
    return Promise.resolve(data.data);
  } catch (e) {
    Promise.reject(e);
  }
};

//   export const remove = async (
//     state,
//     dispatch,
//     addProcess,
//     removeProcess,
//     removeItem,
//     path,
//     itemId
//   ) => {
//     const processings = state.processings;
//     if (processings.includes(itemId)) {
//       return Promise.reject(new Error("This item is being deleted."));
//     }

//     dispatch(addProcess(itemId));
//     try {
//       await API.delete(`${path}/${itemId}`);
//       dispatch(removeItem(itemId));
//       dispatch(removeProcess(itemId));
//       return Promise.resolve();
//     } catch (e) {
//       dispatch(removeProcess(itemId));
//       return Promise.reject(e);
//     }
//   };
