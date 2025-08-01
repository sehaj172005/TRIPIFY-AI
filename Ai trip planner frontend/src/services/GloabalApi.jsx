import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
const API_KEY = import.meta.env.VITE_APP_GOOGLE_PLACE_API_KEY
const config = {
  headers: {
    "Content-type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.photos",
  },
};

export const GetPlaceDetails = (data) => {
  return axios.post(BASE_URL, data, config);  // return the promise
};
