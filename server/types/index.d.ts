import type { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    mobileNumber: string;
    role: string;
    fullName: string;
  };
}
