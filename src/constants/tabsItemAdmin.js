import { Admin, Group } from "@styled-icons/remix-line";
import { Language } from "@styled-icons/ionicons-sharp";
import { CategoryAlt, Home } from "@styled-icons/boxicons-regular";
import { Settings2Outline } from "@styled-icons/evaicons-outline";

const tabsItemAdmin = [
  {
    id: 1,
    title: "Dashboard",
    icon: <Home width={24} />,
    url: "/dashboard",
  },
  {
    id: 2,
    title: "Users",
    icon: <Group width={24} />,
    url: "/users",
  },
  {
    id: 3,
    title: "Morderators",
    icon: <Admin width={24} />,
    url: "/moderators",
  },
  {
    id: 4,
    title: "Categories",
    icon: <CategoryAlt width={24} />,
    url: "/categories",
  },
  {
    id: 5,
    title: "Languages",
    icon: <Language width={24} />,
    url: "/languages",
  },
  {
    id: 6,
    title: "Settings",
    icon: <Settings2Outline width={24} />,
    url: "/settings",
  },
];

export default tabsItemAdmin;
