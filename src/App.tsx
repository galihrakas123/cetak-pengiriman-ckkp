import { BrowserRouter as Router } from "react-router-dom";

import renderRoutes, { routes } from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthContextProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  const queryClient = new QueryClient();

  return (
    <Router basename={"/"}>
      <ThemeProvider defaultTheme="light" storageKey="bestrong-app-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthContextProvider>
              <NotificationProvider>
                {renderRoutes(routes)}
                <Toaster />
              </NotificationProvider>
            </AuthContextProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
