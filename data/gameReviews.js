import { ObjectId } from "mongodb";
import { games } from "../config/mongoCollections.js";
import { getUserById } from "./users.js";
import {
  checkString,
  checkDateReleased,
  checkForm,
  checkId,
  checkRating
} from "../helpers.js";