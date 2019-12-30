import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import post from "./post";
import modal from "./modal";

export default combineReducers({ alert, auth, profile, modal, post });
