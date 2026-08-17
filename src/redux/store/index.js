import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../slice/loginSlice";
import authenticateReducer from "../slice/authenticateSlice";
import updateProfileReducer from "../slice/updateProfileSlice";
import changePasswordReducer from "../slice/changePasswordSlice";
import refreshTokenReducer from "../slice/refreshTokenSlice";
import collectionsReducer from "../slice/collectionsSlice";
import collectionVendorsReducer from "../slice/collectionVendorsSlice";
import productsReducer from "../slice/productsSlice";
import syncLogsReducer from "../slice/syncLogsSlice";
import dashboardReducer from "../slice/dashboardSlice";
import getProfileReducer from "../slice/getProfileSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    authenticate: authenticateReducer,
    updateProfile: updateProfileReducer,
    changePassword: changePasswordReducer,
    getProfile: getProfileReducer,
    refreshToken: refreshTokenReducer,
    collections: collectionsReducer,
    collectionVendors: collectionVendorsReducer,
    products: productsReducer,
    syncLogs: syncLogsReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
