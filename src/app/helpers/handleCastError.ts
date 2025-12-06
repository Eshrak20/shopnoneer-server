import { Prisma } from "@prisma/client";
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleInvalidIdError = (err: unknown): TGenericErrorResponse => {
  // Prisma throws a P2023 error if an invalid integer is passed to a query
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2023"
  ) {
    return {
      statusCode: 400,
      message: "Invalid ID. Please provide a valid integer ID",
    };
  }

  return {
    statusCode: 500,
    message: "Something went wrong",
  };
};
