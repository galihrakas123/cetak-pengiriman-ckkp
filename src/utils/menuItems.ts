export interface MenuItemConfig {
  name: string;
  id: string;
  icon: string;
  link?: string;
  collapsed?: boolean;
  role: string | string[];
  children?: {
    name: string;
    link: string;
    role: string | string[];
    icon?: string;
  }[];
}

export const menuItems: MenuItemConfig[] = [
  {
    name: "Dashboard",
    id: "dashboard",
    icon: "home",
    link: "/",
    role: "all",
  },
  {
    name: "Pengiriman SKKP",
    id: "pengiriman-skkp",
    icon: "truck",
    link: "/pengiriman/data",
    collapsed: false,
    role: "all",
    children: [
      {
        name: "Pengelolaan Cetak SKKP",
        link: "/pengiriman/cetak",
        role: "all",
      },
      {
        name: "Pengiriman & Tracking",
        link: "/pengiriman/data",
        role: "all",
      },
      {
        name: "Laporan & Rekap",
        link: "/pengiriman/laporan",
        role: "all",
      },
    ],
  },
];
