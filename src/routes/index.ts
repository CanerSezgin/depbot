import { Router } from 'express';

// Routes
import recordRoute from './record.route';

interface Route {
  path: string;
  route: Router;
  middlewares?: { (): void }[];
}

const router = Router();

const setRoutes = (routes: Route[]) => {
  routes.forEach((route) => {
    if (Array.isArray(route.middlewares) && route.middlewares.length) {
      router.use(route.path, ...route.middlewares, route.route);
    } else {
      router.use(route.path, route.route);
    }
  });
};

const defaultRoutes: Route[] = [
  {
    path: '/record',
    route: recordRoute,
  },
  /*   {
    path: '/user',
    route: userRoute,
    middlewares: [authCheck],
  }, */
];

const devRoutes: Route[] = [];

setRoutes(defaultRoutes);

if (process.env.NODE_ENV !== 'production') {
  setRoutes(devRoutes);
}

export default router;
