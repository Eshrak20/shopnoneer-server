/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@prisma/client";
import { excludeField } from "./constants";

export class PrismaQueryBuilder {
  private readonly prismaModel: any;
  private readonly query: Record<string, any>;
  private prismaQuery: Prisma.ProjectFindManyArgs = {};
  private filterObj: Prisma.ProjectWhereInput = {};

  constructor(prismaModel: any, query: Record<string, any>) {
    this.prismaModel = prismaModel;
    this.query = query;
  }

  filter() {
    const filter: Record<string, any> = { ...this.query };

    for (const field of excludeField) {
      delete filter[field];
    }

    // Date Range
    if (filter.startDate || filter.endDate) {
      this.filterObj.createdAt = {};

      if (filter.startDate) {
        this.filterObj.createdAt.gte = new Date(filter.startDate);
      }

      if (filter.endDate) {
        const end = new Date(filter.endDate);
        end.setHours(23, 59, 59, 999);
        this.filterObj.createdAt.lte = end;
      }
    }

    this.prismaQuery.where = this.filterObj;
    return this;
  }

  /** 🔥 Project-specific filters */
  applyProjectFilters() {
    const q = this.query;

    // Numeric filters
    if (q.bed) this.filterObj.no_of_beds = Number(q.bed);
    if (q.bath) this.filterObj.no_of_baths = Number(q.bath);
    if (q.balcony) this.filterObj.no_of_balcony = Number(q.balcony);

    // Range filters
    if (q.minPrice || q.maxPrice) {
      this.filterObj.total_price = {};
      if (q.minPrice) this.filterObj.total_price.gte = Number(q.minPrice);
      if (q.maxPrice) this.filterObj.total_price.lte = Number(q.maxPrice);
    }

    if (q.minRate || q.maxRate) {
      this.filterObj.rate_per_sqft = {};
      if (q.minRate) this.filterObj.rate_per_sqft.gte = Number(q.minRate);
      if (q.maxRate) this.filterObj.rate_per_sqft.lte = Number(q.maxRate);
    }

    if (q.minArea || q.maxArea) {
      this.filterObj.floor_area = {};
      if (q.minArea) this.filterObj.floor_area.gte = Number(q.minArea);
      if (q.maxArea) this.filterObj.floor_area.lte = Number(q.maxArea);
    }

    // Relations
    if (q.division) this.filterObj.divisionId = Number(q.division);
    if (q.district) this.filterObj.districtId = Number(q.district);
    if (q.upazila) this.filterObj.upazilaId = Number(q.upazila);
    if (q.housing) this.filterObj.housingId = Number(q.housing);

    this.prismaQuery.where = this.filterObj;
    return this;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm || "";

    if (!searchTerm) return this;

    this.prismaQuery.where = {
      ...this.prismaQuery.where,
      OR: searchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    };
    return this;
  }

  sort() {
    const sortValue = this.query?.sort;

    if (!sortValue) {
      // default newest
      this.prismaQuery.orderBy = { createdAt: "desc" };
      return this;
    }

    if (sortValue === "newest") {
      this.prismaQuery.orderBy = { createdAt: "desc" };
    } else if (sortValue === "oldest") {
      this.prismaQuery.orderBy = { createdAt: "asc" };
    } else if (sortValue.startsWith("-")) {
      this.prismaQuery.orderBy = {
        [sortValue.substring(1)]: "desc",
      };
    } else {
      this.prismaQuery.orderBy = {
        [sortValue]: "asc",
      };
    }

    return this;
  }

  fields() {
    if (!this.query?.fields) return this;

    const fields = this.query.fields.split(",");

    this.prismaQuery.select = fields.reduce(
      (acc: Record<string, boolean>, field: string) => {
        acc[field] = true;
        return acc;
      },
      {}
    );

    return this;
  }

  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;

    this.prismaQuery.skip = (page - 1) * limit;
    this.prismaQuery.take = limit;

    return this;
  }

  include(data: Prisma.ProjectInclude) {
    this.prismaQuery.include = data;
    return this;
  }

  build() {
    return this.prismaModel.findMany(this.prismaQuery);
  }

  async getMeta() {
    const total = await this.prismaModel.count({
      where: this.prismaQuery.where,
    });

    const limit = Number(this.query?.limit) || 10;
    const page = Number(this.query?.page) || 1;

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
