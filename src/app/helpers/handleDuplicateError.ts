import { Prisma } from "@prisma/client";
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    let fieldName = "Field";

    if (Array.isArray(err.meta?.target) && err.meta.target.length > 0) {
      fieldName = String(err.meta.target[0]);
    } else if (err.meta?.target) {
      fieldName = String(err.meta.target);
    }

    return {
      statusCode: 400,
      message: `${fieldName} already exists!`,
    };
  }

  return {
    statusCode: 500,
    message: "Something went wrong",
  };
};
