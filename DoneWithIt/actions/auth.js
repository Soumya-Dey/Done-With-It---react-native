import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  CLEAR_PROFILE,
  LOADING,
} from "./types";
import { serverDomainUrl } from "../serverUrl";

// for loading and authenticating user with token
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: LOADING,
    });

    // setting the token to the headers globally
    const token = await AsyncStorage.getItem("token");
    if (token !== null) setAuthToken(token);

    // get the user data
    // don't need to pass the header
    // as the token is already in the header globally
    // returns user data -> name, email...
    const res = await axios.get(`${serverDomainUrl}/api/auth/me`);

    // send the user data to the reducer
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// for registering user
export const register = ({ name, email, password }) => async (dispatch) => {
  try {
    dispatch({
      type: LOADING,
    });
    // get the token after register
    // returns the token upon sucessfull authentication
    const res = await axios.post(
      `${serverDomainUrl}/api/auth/register`,
      JSON.stringify({ name, email, password }),
      { headers: { "Content-Type": "application/json" } }
    );

    // send the token to the reducer
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    // load user after registration
    dispatch(loadUser());
  } catch (error) {
    const errArr = error.response.data.errors;

    // send the errors to the alert reducer
    if (errArr) {
      errArr.forEach((errItem) => dispatch(setAlert(errItem.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAILURE,
    });
  }
};

// for loggin in user
export const login = ({ email, password }) => async (dispatch) => {
  try {
    dispatch({
      type: LOADING,
    });

    // get the token after logging in
    // returns the token upon sucessfull authentication
    const res = await axios.post(
      `${serverDomainUrl}/api/auth/login`,
      JSON.stringify({ email, password }),
      { headers: { "Content-Type": "application/json" } }
    );

    // send the token to the reducer
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    // load the user after login
    dispatch(loadUser());
  } catch (error) {
    const errArr = error.response.data.errors;

    // send the errors to the alert reducer
    if (errArr) {
      errArr.forEach((errItem) => dispatch(setAlert(errItem.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAILURE,
    });
  }
};

// // for sending reset link to user
// export const forgotPassword = (email) => async (dispatch) => {
//     try {
//         // send email
//         await axios.post("/api/auth/forgot", JSON.stringify({ email }), {
//             headers: { "Content-Type": "application/json" },
//         });

//         // send the token to the reducer
//         dispatch(setAlert(`Email sent to ${email} with reset link`, "success"));
//     } catch (error) {
//         const errArr = error.response.data.errors;

//         // send the errors to the alert reducer
//         if (errArr) {
//             errArr.forEach((errItem) =>
//                 dispatch(setAlert(errItem.msg, "danger"))
//             );
//         }
//     }
// };

// // for reseting user password
// export const resetPassword = (password, resetPasswordId) => async (
//     dispatch
// ) => {
//     try {
//         // reset password
//         await axios.post(
//             `/api/auth/reset/${resetPasswordId}`,
//             JSON.stringify({ password }),
//             { headers: { "Content-Type": "application/json" } }
//         );

//         // send the token to the reducer
//         dispatch(
//             setAlert(`Password changed successfully, Login again`, "success")
//         );
//     } catch (error) {
//         const errArr = error.response.data.errors;

//         // send the errors to the alert reducer
//         if (errArr) {
//             errArr.forEach((errItem) =>
//                 dispatch(setAlert(errItem.msg, "danger"))
//             );
//         }
//     }
// };

// for loggin out user & clear profile
export const logout = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
