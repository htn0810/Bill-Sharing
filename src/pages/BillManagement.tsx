import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BillStatus, TBill, TExpense } from "@/ProjectType";
import { useNavigate, useParams } from "react-router";
import { billsService } from "@/services/billsService";
import { formatBalance } from "@/utils/utils";
import ExpenseItem from "@/modules/expense-item/ExpenseItem";
import AddExpense from "@/modules/add-expense/AddExpense";
import { expenseService } from "@/services/expenseService";

const BillManagement = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState<TBill>();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState<TExpense[]>([]);

  useEffect(() => {
    fetchBill();
    fetchExpenses();
  }, [billId]);

  const fetchBill = async () => {
    if (billId) {
      const billData = await billsService.getBillById(billId);
      setBill(billData!);
    }
  };

  const fetchExpenses = async () => {
    if (billId) {
      const billExpenses = await expenseService.getExpensesByBillId(
        parseInt(billId!)
      );
      setExpenses(billExpenses);
    }
  };

  const completeBill = async () => {
    try {
      await billsService.updateBillStatus(bill!.id, BillStatus.Completed);
      navigate("/");
    } catch (error) {
      console.error("Error completing bill:", error);
    }
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const calculateBalances = () => {
    const balances: { [key: string]: number } = {};
    bill?.members.forEach((roommate) => {
      balances[roommate] = 0;
    });

    expenses.forEach((expense) => {
      const perPerson = parseFloat(expense.amount) / bill?.members.length!;
      bill?.members.forEach((roommate) => {
        if (roommate === expense.paidBy) {
          balances[roommate] += parseFloat(expense.amount) - perPerson;
        } else {
          balances[roommate] -= perPerson;
        }
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>House Expenses</CardTitle>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
              <Button
                className="w-full sm:w-auto bg-yellow-500 text-white hover:bg-yellow-700 cursor-pointer"
                onClick={() => setShowAddExpense(!showAddExpense)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-green-500 text-white hover:bg-green-700 cursor-pointer"
                onClick={() => completeBill()}
              >
                Complete Bill
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 space-y-6">
          {showAddExpense && (
            <AddExpense
              bill={bill!}
              onShowAddExpense={setShowAddExpense}
              setExpenses={setExpenses}
            />
          )}

          <div className="space-y-3">
            <h3 className="font-semibold">Recent Expenses</h3>
            <div className="overflow-auto max-h-[50vh] space-y-4">
              {expenses.map((expense) => (
                <ExpenseItem
                  expense={expense}
                  deleteExpense={deleteExpense}
                  billStatus={bill!.status}
                  key={expense.id + expense.description}
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Current Balances</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(balances).map(([roommate, balance]) => (
                <div
                  key={roommate}
                  className="p-3 bg-gray-200 rounded-lg flex justify-between items-center"
                >
                  <p className="font-medium">{roommate}</p>
                  <p
                    className={`text-lg ${
                      balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatBalance(parseFloat(balance.toFixed(2)))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillManagement;
