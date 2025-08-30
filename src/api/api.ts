import axios from "axios";
import https from "https";

export const minjustApi = axios.create({
    baseURL: "https://minjust.gov.ru/ru/extremist-materials/",
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});