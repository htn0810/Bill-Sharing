import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TBill, TCategory, TExpense } from "@/ProjectType";
import { categoryService } from "@/services/categoryService";
import { formatVND } from "@/utils/utils";
import React, { useEffect, useState } from "react";
import { expenseService } from "@/services/expenseService";

type Props = {
  bill: TBill;
  setExpenses: React.Dispatch<React.SetStateAction<TExpense[]>>;
  onShowAddExpense: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddExpense = (props: Props) => {
  const { bill, onShowAddExpense, setExpenses } = props;
  const InitialExpense = {
    id: Date.now(),
    billId: bill.id,
    description: "",
    amount: "",
    paidBy: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  };
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [newExpense, setNewExpense] = useState<TExpense>(InitialExpense);
  const [inputErrors, setInputErrors] = useState({
    description: false,
    amount: false,
    paidBy: false,
    category: false,
    date: false,
  });

  useEffect(() => {
    fetchCategories();
  }, [bill.id]);
  const fetchCategories = async () => {
    const categories = await categoryService.getAllCategories();
    setCategories(categories);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExpense({
      ...newExpense,
      description: e.target.value,
    });
    if (e.target.value) {
      setInputErrors({
        ...inputErrors,
        description: false,
      });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, "");

    setNewExpense({
      ...newExpense,
      amount: numericValue,
    });
    if (numericValue) {
      setInputErrors({
        ...inputErrors,
        amount: false,
      });
    }

    const cursorPos = e.target.selectionStart || 0;
    setTimeout(() => {
      e.target.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handlePaidByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewExpense({
      ...newExpense,
      paidBy: e.target.value,
    });
    if (e.target.value) {
      setInputErrors({
        ...inputErrors,
        paidBy: false,
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExpense({
      ...newExpense,
      date: e.target.value,
    });
    if (e.target.value) {
      setInputErrors({
        ...inputErrors,
        date: false,
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewExpense({
      ...newExpense,
      category: e.target.value,
    });
    if (e.target.value) {
      setInputErrors({
        ...inputErrors,
        category: false,
      });
    }
  };

  const addExpense = () => {
    const errors = {
      description: !newExpense.description,
      amount: !newExpense.amount,
      paidBy: !newExpense.paidBy,
      category: !newExpense.category,
      date: !newExpense.date,
    };

    setInputErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      toast.error("Please fill in all fields", {
        description: "All fields are required!",
      });
      return;
    }

    expenseService.createExpense(newExpense);

    setExpenses((prev) => [...prev, { ...newExpense, id: Date.now() }]);
    setNewExpense(InitialExpense);
    onShowAddExpense(false);
    setInputErrors({
      description: false,
      amount: false,
      paidBy: false,
      category: false,
      date: false,
    });

    toast.success("Expense added successfully!", {
      description: `${formatVND(newExpense.amount)} paid by ${
        newExpense.paidBy
      }`,
    });
  };

  return (
    <div className="border rounded-lg p-3 space-y-3">
      <Input
        type="text"
        placeholder="Description"
        value={newExpense.description}
        onChange={handleDescriptionChange}
        className={`w-full ${
          inputErrors.description ? "border-red-500 bg-red-50" : ""
        }`}
      />
      <div className="flex gap-2">
        <Input
          type="text"
          value={newExpense.amount ? formatVND(newExpense.amount) : ""}
          onChange={handleAmountChange}
          className={`flex-1 ${
            inputErrors.amount ? "border-red-500 bg-red-50" : ""
          }`}
          placeholder="Amount"
        />
        <select
          value={newExpense.paidBy}
          onChange={handlePaidByChange}
          className={`flex-1 border rounded-md px-3 py-1 ${
            inputErrors.paidBy ? "border-red-500 bg-red-50" : ""
          }`}
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
          onChange={handleDateChange}
          className={`flex-1 ${
            inputErrors.date ? "border-red-500 bg-red-50" : ""
          }`}
        />
        <select
          value={newExpense.category}
          onChange={handleCategoryChange}
          className={`flex-1 border rounded-md px-3 py-1 cursor-pointer ${
            inputErrors.category ? "border-red-500 bg-red-50" : ""
          }`}
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
        onClick={addExpense}
        className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
      >
        Add Expense
      </Button>
    </div>
  );
};

export default AddExpense;
