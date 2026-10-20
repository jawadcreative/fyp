import { Account, Avatars, Client, TablesDB } from "appwrite";

const required = [
  "VITE_APPWRITE_PROJECT_ID",
  "VITE_APPWRITE_PROJECT_NAME",
  "VITE_APPWRITE_ENDPOINT",
  "VITE_APPWRITE_API_KEY",
  "VITE_APPWRITE_DATABASE_ID",
  "VITE_APPWRITE_USERS_TABLE_ID",
  "VITE_APPWRITE_TRIPS_TABLE_ID",
  "VITE_GEMINI_API_KEY",
  "VITE_UNSPLASH_ACCESS_KEY",
];

required.forEach((key) => {
  if (!import.meta.env[key]) {
    console.log(`${key} not found in .env`);
  }
});

export const config = {
  apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
  endPoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
  userstableID: import.meta.env.VITE_APPWRITE_USERS_TABLE_ID,
  tripsTableID: import.meta.env.VITE_APPWRITE_TRIPS_TABLE_ID,
  unsplashAccessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
};

const client = new Client()
  .setEndpoint(config.endPoint)
  .setProject(config.projectID);

const account = new Account(client);
const tableDB = new TablesDB(client);
const avatar = new Avatars(client)

export { account, tableDB, avatar };
