import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { BillStatus, TBill, TCategory, TExpense } from "@/ProjectType";
import { useNavigate, useParams } from "react-router";
import { billsService } from "@/services/billsService";
import { categoryService } from "@/services/categoryService";
import { formatBalance, formatDate, formatVND } from "@/utils/utils";

const BillManagement = () => {
  const { billId } = useParams();
  const InitialExpense = {
    id: Date.now(),
    billId: parseInt(billId!),
    description: "",
    amount: "",
    paidBy: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  };

  const navigate = useNavigate();
  const [bill, setBill] = useState<TBill>();
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState<TExpense[]>([]);
  const [newExpense, setNewExpense] = useState<TExpense>(InitialExpense);

  useEffect(() => {
    fetchBill();
    fetchCategories();
  }, [billId]);

  const fetchCategories = async () => {
    const categories = await categoryService.getAllCategories();
    setCategories(categories);
  };

  const fetchBill = async () => {
    if (billId) {
      const billData = await billsService.getBillById(billId);
      console.log(billData);
      setBill(billData!);
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

  const addExpense = () => {
    if (
      newExpense.description &&
      newExpense.amount &&
      newExpense.paidBy &&
      newExpense.category
    ) {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
      setNewExpense(InitialExpense);
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Remove all non-numeric characters
    const numericValue = input.replace(/[^0-9]/g, "");

    // Store raw number in state
    setNewExpense({
      ...newExpense,
      amount: numericValue,
    });

    // Set cursor position after the number
    const cursorPos = e.target.selectionStart || 0;
    setTimeout(() => {
      e.target.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

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
            <div className="border rounded-lg p-3 space-y-3">
              <Input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    description: e.target.value,
                  })
                }
                className="w-full"
              />
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newExpense.amount ? formatVND(newExpense.amount) : ""}
                  onChange={handleAmountChange}
                  className="flex-1"
                  placeholder="Amount"
                />
                <select
                  value={newExpense.paidBy}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, paidBy: e.target.value })
                  }
                  className="flex-1 border rounded-md px-3 py-1"
                >
                  <option value="">Paid by</option>
                  {bill?.members.map((roommate) => (
                    <option key={roommate} value={roommate}>
                      {roommate}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="flex-1"
                />
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className="flex-1 border rounded-md px-3 py-1 cursor-pointer"
                >
                  <option value="">Categories</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={() => {
                  addExpense();
                  setShowAddExpense(false);
                }}
                className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
              >
                Add Expense
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold">Recent Expenses</h3>
            <div className="overflow-auto max-h-[50vh] space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-3 bg-blue-100 rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-600">
                        Paid by: {expense.paidBy}
                      </p>
                      <p className="text-sm text-gray-600">
                        Category: {expense.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(expense.date)}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium">
                        {formatBalance(parseFloat(expense.amount))}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExpense(expense.id)}
                        className="h-6 w-6 text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
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
