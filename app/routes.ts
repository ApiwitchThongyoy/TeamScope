import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),                                // "/" → Login
  route("register", "routes/register.tsx"),                 // "/register"
  route("forgot-password", "routes/forgot-password.tsx"),   // "/forgot-password"
  route("home", "routes/home.tsx"),                         // "/home"
  route("setting", "routes/setting.tsx"),                   // "/setting"
  route("board/:boardName", "routes/board.$boardName.tsx"), // "/board/:boardName"
] satisfies RouteConfig;