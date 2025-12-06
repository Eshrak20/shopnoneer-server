import { Prisma } from "@prisma/client";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleZodError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  // ---- Prisma Known Request Errors ----
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2000": // Value too long
        if (err.meta?.column_name) {
          errorSources.push({
            path: String(err.meta.column_name),
            message: "Value too long for this field",
          });
        }
        break;

      case "P2002": // Unique constraint violation
        if (Array.isArray(err.meta?.target)) {
          (err.meta.target as string[]).forEach((field) => {
            errorSources.push({
              path: String(field),
              message: `${field} already exists`,
            });
          });
        } else if (err.meta?.target) {
          errorSources.push({
            path: String(err.meta.target),
            message: `${err.meta.target} already exists`,
          });
        }
        break;

      case "P2003": // Foreign key violation
        if (err.meta?.field_name) {
          errorSources.push({
            path: String(err.meta.field_name),
            message: "Invalid relation value",
          });
        }
        break;

      default:
        errorSources.push({
          path: "unknown",
          message: err.message,
        });
    }

    return {
      statusCode: 400,
      message: "Zod Validation Error",
      errorSources,
    };
  }

  // ---- Zod Validation Errors ----
  if (err?.issues) {
    err.issues.forEach((issue: any) => {
      errorSources.push({
        path: String(issue.path[issue.path.length - 1]),
        message: issue.message,
      });
    });

    return {
      statusCode: 400,
      message: "Validation Error",
      errorSources,
    };
  }

  // ---- Fallback for other errors ----
  return {
    statusCode: 500,
    message: "Something went wrong",
    errorSources: [],
  };
};
