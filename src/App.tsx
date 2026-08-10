import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { AuthProvider } from "@/contexts/AuthContext";
import { CampaignsProvider } from "@/contexts/CampaignsContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { useEffect } from "react";
import Lenis from "lenis";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

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
