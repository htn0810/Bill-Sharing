import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, History } from "lucide-react";
import { TBill } from "@/ProjectType";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateBillDialog from "@/modules/create-bill-dialog/CreateBillDialog";
import { billsService } from "@/services/billsService";
import { formatDateTime } from "@/utils/utils";

const Home = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<TBill[]>([]);

  useEffect(() => {
    fetchAllBills();
  }, []);

  const fetchAllBills = async () => {
    try {
      const existedBills = await billsService.getAllBills();
      setBills(existedBills);
    } catch (error) {
      console.error(error);
    }
  };

  const continueBill = (bill: TBill) => {
    navigate(`/${bill.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Bill History</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full p-3 flex sm:w-auto cursor-pointer bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Bill
                </Button>
              </DialogTrigger>
              <CreateBillDialog bills={bills} setBills={setBills} />
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.id + bill.name}
                className={`p-3 rounded-lg border ${
                  bill.status === "completed" ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <h3 className="font-medium">
                      Bill #{bill.id}_{bill.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Created: {formatDateTime(bill.createdAt)}
                    </p>
                    {bill.completedAt && (
                      <p className="text-sm text-gray-600">
                        Completed: {formatDateTime(bill.completedAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        bill.status === "completed"
                          ? "bg-green-400"
                          : "bg-blue-400 "
                      }`}
                    >
                      {bill.status === "completed" ? "Completed" : "Active"}
                    </span>
                    {bill.status === "active" && (
                      <Button
                        variant="outline"
                        onClick={() => continueBill(bill)}
                        className="w-full px-3 py-2 flex sm:w-auto cursor-pointer bg-black text-white hover:bg-gray-800"
                      >
                        <History className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {bills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bills yet. Create one to get started!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
