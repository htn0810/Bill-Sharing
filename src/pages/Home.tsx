import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TBill } from "@/ProjectType";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateBillDialog from "@/modules/create-bill-dialog/CreateBillDialog";
import { billsService } from "@/services/billsService";
import BillItem from "@/modules/bill-item/BillItem";

const Home = () => {
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

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4">
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
              <BillItem key={bill.id + bill.name} bill={bill} />
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
