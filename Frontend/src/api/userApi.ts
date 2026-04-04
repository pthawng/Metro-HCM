import api from "./axiosInstance";
import { UserSchema, User } from "../types/schema";
import { z } from "zod";

/**
 * User API Module
 * Standardized with Zod for runtime type safety.
 */

export const getAllUsers = async (): Promise<User[]> => {
  const data = await api.get("/users");
  return z.array(UserSchema).parse(data);
};

export const getUserById = async (id: string): Promise<User> => {
  const data = await api.get(`/users/${id}`);
  return UserSchema.parse(data);
};

export const createUser = async (userData: Partial<User>): Promise<{ userId: string; message: string }> => {
  return await api.post("/users", userData);
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const data = await api.patch(`/users/${id}`, userData);
  return UserSchema.parse(data);
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  return await api.delete(`/users/${id}`);
};

export const getUserStats = async (): Promise<any> => {
  return await api.get("/users/stats");
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
  return await api.post("/users/change-password", {
    oldPassword,
    newPassword,
  });
};
