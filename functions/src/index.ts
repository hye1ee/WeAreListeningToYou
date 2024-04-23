import * as functions from "firebase-functions";
import { app } from "./server"

export const server = functions.https.onRequest(app);