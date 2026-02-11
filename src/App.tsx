import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import ActiveWorkflow from "./pages/ActiveWorkflow";
import PendingActions from "./pages/PendingActions";
import DelayedActions from "./pages/DelayedActions";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/active-workflow" element={<ActiveWorkflow />} />
              <Route path="/pending-actions" element={<PendingActions />} />
              <Route path="/delayed-actions" element={<DelayedActions />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
