import { ID, Query } from "appwrite";
import { account, avatar, config, tableDB } from "./config";
import { useEffect } from "react";

// Login user
export const loginUser = async ({ email, password }) => {
  try {
    const session = await account.createEmailPasswordSession(
      email.trim().toLowerCase(),
      password,
    );

    return session;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Register user
export const registerUser = async ({ name, email, password }) => {
  let newAccount = null;

  try {
    const cleanName = name?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    // Validate inputs
    if (!cleanName || !cleanEmail || !password?.trim()) {
      throw new Error("All fields are required.");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    newAccount = await account.create(
      ID.unique(),
      cleanEmail,
      password,
      cleanName,
    );

    const imageUrl = avatar.getInitials(name)

    // Store profile data (never store passwords)
    const userData = await tableDB.createRow(
      config.databaseID,
      config.userstableID,
      ID.unique(),
      {
        userId: newAccount.$id,
        name: cleanName,
        email: cleanEmail,
        password,
        avatar: imageUrl
      },
    );

    // Automatically log in after registration
    const session = await loginUser({
      email: cleanEmail,
      password,
    });

    return {
      success: true,
      user: userData,
      session,
      message: "Account registered successfully.",
    };
  } catch (error) {
    console.error("Registration failed:", error);

    if (newAccount) {
      console.error(
        "Account was created; profile creation or login may have failed.",
        { userId: newAccount.$id },
      );
    }

    throw error;
  }
};

// Get currently logged-in user's profile
export const getCurrentUser = async () => {
  try {
    // Get authenticated Appwrite account
    const currentAccount = await account.get();

    // Find the user's profile
    const response = await tableDB.listRows(
      config.databaseID,
      config.userstableID,
      [Query.equal("userId", currentAccount.$id)],
    );

    if (response.rows.length === 0) {
      throw new Error("User profile not found.");
    }

    return response.rows[0];
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await tableDB.listRows(
      config.databaseID,
      config.userstableID,
      [Query.limit(limit), Query.offset((page - 1) * limit)],
    );

    return {
      users: response.rows,
      total: response.total,
    };
  } catch (error) {
    console.error("Failed to fetch all users:", error);
    throw error;
  }
};

export const getUserRegistrationStats = async () => {
  const now = new Date();

  // Start of this month
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const tomorrowStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const yesterdayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );

  const countRows = async (start, end) => {
    const response = await tableDB.listRows(
      config.databaseID,
      config.userstableID,
      [
        Query.greaterThanEqual("$createdAt", start.toISOString()),
        Query.lessThan("$createdAt", end.toISOString()),
        Query.limit(1),
      ],
    );

    return response.total;
  };

  const [today, yesterday] = await Promise.all([
    countRows(todayStart, tomorrowStart),
    countRows(yesterdayStart, todayStart),
  ]);

  const percentage =
    yesterday === 0
      ? today === 0
        ? 0
        : null
      : Number((((today - yesterday) / yesterday) * 100).toFixed(1));

  return {
    today,
    yesterday,
    percentage,
    direction:
      percentage === null
        ? "new"
        : percentage > 0
          ? "increase"
          : percentage < 0
            ? "decrease"
            : "unchanged",
  };
};
