import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { HousingRoutes } from "../modules/housing/housing.routes";
import { FacilitiesRoutes } from "../modules/facilities/facilities.routes";
import { AmenityRoutes } from "../modules/amenity/amenity.routes";
import { ProjectRoutes } from "../modules/project/project.routes";

export const router = Router();

const moduleRoutes = [

  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/housing",
    route: HousingRoutes,
  },
  {
    path: "/facilities",
    route: FacilitiesRoutes,
  },
  {
    path: "/amenity",
    route: AmenityRoutes,
  },
  {
    path: "/project",
    route: ProjectRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
