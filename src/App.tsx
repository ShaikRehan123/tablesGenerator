import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TablesPage from "./routes/tables";
import RootLayout from "./RootLayout";
import SumsPage from "./routes/sums";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <TablesPage />,
      },
      {
        path: "sums",
        element: <SumsPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
