import React, { ComponentType, LazyExoticComponent, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./layout";
import GuestGuard from "./components/auth/GuestGuard";
import AuthGuard from "./components/auth/AuthGuard";
import Loader from "./components/loader";

type TRoute = {
  exact?: boolean;
  guard?: ComponentType<{ children: React.ReactNode; role?: string | string[] }>;
  layout?: ComponentType<{ children: React.ReactNode }>;
  path: string;
  element: LazyExoticComponent<ComponentType<any>>;
  role?: string | string[];
  routes?: TRoute[];
};

export const routes: TRoute[] = [
  {
    exact: true,
    guard: GuestGuard,
    path: "/login",
    role: "all",
    element: React.lazy(() => import("./pages/login")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/",
    role: "all",
    element: React.lazy(() => import("./pages/beranda")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/dashboard",
    role: "all",
    element: React.lazy(() => import("./pages/beranda")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/pengiriman",
    role: "all",
    element: React.lazy(() => import("./pages/pengiriman-cetak")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/pengiriman/data",
    role: "all",
    element: React.lazy(() => import("./pages/pengiriman-data")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/pengiriman/cetak",
    role: "all",
    element: React.lazy(() => import("./pages/pengiriman-cetak")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/cetak-skkp",
    role: "all",
    element: React.lazy(() => import("./pages/pengiriman-cetak")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/cetak",
    role: "all",
    element: React.lazy(() => import("./pages/pengiriman-cetak")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/pengiriman/tracking",
    role: "all",
    element: React.lazy(() => import("./pages/pengiriman-tracking")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/tracking",
    role: "all",
    element: React.lazy(() => import("./pages/pengiriman-tracking")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/pengiriman/laporan",
    role: "all",
    element: React.lazy(() => import("./pages/pengiriman-laporan")),
  },
  {
    exact: true,
    layout: Layout,
    guard: AuthGuard,
    path: "/laporan",
    role: "all",
    element: React.lazy(() => import("./pages/pengiriman-laporan")),
  },
  {
    exact: true,
    guard: AuthGuard,
    layout: Layout,
    path: "/logout",
    role: "all",
    element: React.lazy(() => import("./pages/logout")),
  },
  {
    exact: true,
    guard: AuthGuard,
    layout: Layout,
    path: "/change-password",
    role: "all",
    element: React.lazy(() => import("./pages/change-password")),
  },
  {
    exact: true,
    path: "/maintenance",
    role: "all",
    element: React.lazy(() => import("./pages/maintenance-page")),
  },
  {
    layout: Layout,
    guard: AuthGuard,
    path: "/404",
    role: "all",
    element: React.lazy(() => import("./pages/not-found")),
  },
  {
    layout: Layout,
    guard: AuthGuard,
    path: "*",
    role: "all",
    element: React.lazy(() => import("./pages/not-found")),
  },
];

const renderRoutes = (routesList: TRoute[] = []) => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routesList.map((route, i) => {
          const Guard: any = route.guard || React.Fragment;
          const LayoutComponent = route.layout || React.Fragment;
          const Element = route.element;
          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Guard role={route.role}>
                  <LayoutComponent>
                    {route.routes ? renderRoutes(route.routes) : <Element />}
                  </LayoutComponent>
                </Guard>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default renderRoutes;
