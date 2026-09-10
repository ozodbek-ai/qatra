import { Platform } from "react-native";

const API_PORT = 5000;

/*
|--------------------------------------------------------------------------
| API Base URL
|--------------------------------------------------------------------------
|
| Android telefon real qurilma bo'lsa:
| MacBook IP manzilidan foydalanamiz.
|
*/

const DEV_MACHINE_IP = "192.168.1.184";

export const API_BASE_URL =
  "http://192.168.1.184:3000";

export const API_URL =
  `${API_BASE_URL}/api/v1`;

export const REEL_CATEGORY_API_URL =
  `${API_BASE_URL}/api/reel-categories`;