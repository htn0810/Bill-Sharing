import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  UserPlus,
  X,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { BillStatus, TBill, TExpense } from "@/ProjectType";

const BillManagement = () => {
  // All state declarations
  const [bills, setBills] = useState<TBill[]>([]);
  const [showExpenseTracker, setShowExpenseTracker] = useState(false);
  const [currentBill, setCurrentBill] = useState<TBill | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState<TExpense[]>([]);
  const [roommates, setRoommates] = useState<string[]>(["Nhan"]);
  const [newMember, setNewMember] = useState("");
  const [newExpense, setNewExpense] = useState<TExpense>({
    id: Date.now(),
    description: "",
    amount: "",
    paidBy: "",
    date: new Date().toISOString().split("T")[0],
  });

  // All function definitions
  const createNewBill = () => {
    const newBill = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: BillStatus.Active,
      expenses: [],
      members: ["Nhan"],
    };
    setBills([...bills, newBill]);
    setCurrentBill(newBill);
    setExpenses([]);
    setRoommates(["John", "Sarah", "Mike"]);
    setShowExpenseTracker(true);
  };

  const completeBill = () => {
    setBills(
      bills.map((bill) =>
        bill.id === currentBill?.id
          ? {
              ...bill,
              status: BillStatus.Completed,
              completedAt: new Date().toISOString(),
              expenses: expenses,
              members: roommates,
            }
          : bill
      )
    );
    setShowExpenseTracker(false);
    setCurrentBill(null);
  };

  const continueBill = (bill: TBill) => {
    setCurrentBill(bill);
    setExpenses(bill.expenses || []);
    setRoommates(bill.members || ["John", "Sarah", "Mike"]);
    setShowExpenseTracker(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.paidBy) {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
      setNewExpense({
        id: Date.now(),
        description: "",
        amount: "",
        paidBy: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const addMember = () => {
    if (newMember && !roommates.includes(newMember)) {
      setRoommates([...roommates, newMember]);
      setNewMember("");
    }
  };

  const deleteMember = (memberToDelete: string) => {
    if (roommates.length > 1) {
      setRoommates(roommates.filter((member) => member !== memberToDelete));
      setExpenses(
        expenses.filter((expense) => expense.paidBy !== memberToDelete)
      );
    }
  };

  const calculateBalances = () => {
    const balances: { [key: string]: number } = {};
    roommates.forEach((roommate) => {
      balances[roommate] = 0;
    });

    expenses.forEach((expense) => {
      const perPerson = parseFloat(expense.amount) / roommates.length;
      roommates.forEach((roommate) => {
        if (roommate === expense.paidBy) {
          balances[roommate] += parseFloat(expense.amount) - perPerson;
        } else {
          balances[roommate] -= perPerson;
        }
      });
    });

    return balances;
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0, // Ensure no decimals
    }).format(Math.ceil(balance)); // Use Math.ceil to round up
  };

  if (showExpenseTracker) {
    const balances = calculateBalances();

    return (
      <div className="max-w-4xl mx-auto p-2 sm:p-4">
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>House Expenses</CardTitle>
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => setShowAddExpense(!showAddExpense)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => completeBill()}
                >
                  Complete Bill
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 space-y-6">
            <div className="border rounded-lg">
              <button
                className="w-full p-3 flex justify-between items-center bg-gray-50 rounded-t-lg"
                onClick={() => setShowMembers(!showMembers)}
              >
                <span className="font-semibold">Manage Members</span>
                {showMembers ? <ChevronUp /> : <ChevronDown />}
              </button>
              {showMembers && (
                <div className="p-3 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="New member name"
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addMember}>
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {roommates.map((member) => (
                      <div
                        key={member}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                      >
                        <span>{member}</span>
                        <button
                          onClick={() => deleteMember(member)}
                          className="text-gray-500 hover:text-red-500"
                          disabled={roommates.length <= 1}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                    type="number"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="flex-1"
                  />
                  <select
                    value={newExpense.paidBy}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, paidBy: e.target.value })
                    }
                    className="flex-1 border rounded-md px-3 py-2"
                  >
                    <option value="">Paid by</option>
                    {roommates.map((roommate) => (
                      <option key={roommate} value={roommate}>
                        {roommate}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="w-full"
                />
                <Button
                  onClick={() => {
                    addExpense();
                    setShowAddExpense(false);
                  }}
                  className="w-full"
                >
                  Add Expense
                </Button>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold">Recent Expenses</h3>
              <div className="space-y-2">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="p-3 bg-gray-50 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-600">
                          Paid by {expense.paidBy}
                        </p>
                        <p className="text-sm text-gray-600">{expense.date}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium">
                          {formatBalance(parseFloat(expense.amount))}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteExpense(expense.id)}
                          className="h-6 w-6"
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
                    className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
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
  }

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Bill History</CardTitle>
            <Button onClick={createNewBill} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create New Bill
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className={`p-3 rounded-lg border ${
                  bill.status === "completed" ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <h3 className="font-medium">Bill #{bill.id}</h3>
                    <p className="text-sm text-gray-600">
                      Created: {formatDate(bill.createdAt)}
                    </p>
                    {bill.completedAt && (
                      <p className="text-sm text-gray-600">
                        Completed: {formatDate(bill.completedAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        bill.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {bill.status === "completed" ? "Completed" : "Active"}
                    </span>
                    {bill.status === "active" && (
                      <Button
                        variant="outline"
                        onClick={() => continueBill(bill)}
                        className="w-full sm:w-auto"
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

export default BillManagement;
