import { ID, Query } from "appwrite"
import { account, config, tableDB } from "./config"

export const generateTrip = async ({ trip, imageUrls }) => {
  try {
    const user = await account.get()
    const result = await tableDB.createRow(config.databaseID, config.tripsTableID, ID.unique(), {
      tripDetails: JSON.stringify(trip),
      imageUrls: JSON.stringify(imageUrls),
      userId: user.$id,
    })

    return result
  } catch (e) {
    console.log("generateTrip", e)
  }
}

export const getTripById = async (id) => {
  try {
    const result = await tableDB.getRow(
      config.databaseID,
      config.tripsTableID,
      id
    );

    return {
      ...result,
      tripDetails: JSON.parse(result.tripDetails),
      imageUrls: JSON.parse(result.imageUrls),
    };
  } catch (error) {
    console.error("Failed to fetch trip:", error);
    throw error;
  }
};

export const getAllTrips = async (limit) => {
  try {
    const allTrips = await tableDB.listRows(
      config.databaseID,
      config.tripsTableID,
      [Query.limit(limit), Query.orderDesc('$createdAt')]
    )

    return allTrips.rows
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    throw error;
  }
}