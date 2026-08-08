import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { AuthProvider } from "@/contexts/AuthContext";
import { CampaignsProvider } from "@/contexts/CampaignsContext";
import { ScrollToTop } from "@/components/common/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <CampaignsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </CampaignsProvider>
    </AuthProvider>
  );
}

export default App;
