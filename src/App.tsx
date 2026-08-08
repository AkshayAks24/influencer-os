import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { AuthProvider } from "@/contexts/AuthContext";
import { CampaignsProvider } from "@/contexts/CampaignsContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ScrollToTop } from "@/components/common/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <CampaignsProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
          </BrowserRouter>
        </NotificationsProvider>
      </CampaignsProvider>
    </AuthProvider>
  );
}

export default App;
