import { Toaster } from "sonner";
import BillManagement from "@/pages/BillManagement";
import Home from "@/pages/Home";
import { Route, Routes } from "react-router";

const App = () => {
  return (
    <>
      <div className="max-w-5xl mx-auto p-2 sm:p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:billId" element={<BillManagement />} />
        </Routes>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
};

export default App;
