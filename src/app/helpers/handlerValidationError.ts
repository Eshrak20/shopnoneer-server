import { Prisma } from "@prisma/client";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlePrismaValidationError = (err: any): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = [];

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2000": // Value too long for column
                if (err.meta?.column_name) {
                    errorSources.push({
                        path: String(err.meta.column_name), // <-- cast to string
                        message: "Value too long for this field",
                    });
                }
                break;

            case "P2003": // Foreign key violation
                if (err.meta?.field_name) {
                    errorSources.push({
                        path: String(err.meta.field_name), // <-- cast to string
                        message: "Invalid relation value",
                    });
                }
                break;

            case "P2002": // Unique constraint
                if (Array.isArray(err.meta?.target)) {
                    (err.meta.target as string[]).forEach((field) => {
                        errorSources.push({
                            path: String(field), // safe string
                            message: `${field} already exists`,
                        });
                    });
                } else if (err.meta?.target) {
                    // fallback if target is a single string
                    errorSources.push({
                        path: String(err.meta.target),
                        message: `${err.meta.target} already exists`,
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
            message: "Validation error",
            errorSources,
        };
    }

    // If error is from Zod or other schema validation
    if (err?.issues) {
        err.issues.forEach((issue: any) => {
            errorSources.push({
                path: issue.path.join("."), // already string
                message: issue.message,
            });
        });

        return {
            statusCode: 400,
            message: "Validation Error",
            errorSources,
        };
    }

    // Fallback
    return {
        statusCode: 500,
        message: "Something went wrong",
        errorSources: [],
    };
};
