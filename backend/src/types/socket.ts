import type { UserRole } from "../generated/prisma/enums.js";

export interface SocketUser {
  userId: string;
  email: string;
  role: UserRole;
}