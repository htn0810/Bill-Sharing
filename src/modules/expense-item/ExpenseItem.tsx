import { Button } from "@/components/ui/button";
import { TExpense } from "@/ProjectType";
import { formatBalance, formatDate } from "@/utils/utils";
import { Trash2 } from "lucide-react";

type Props = {
  expense: TExpense;
  deleteExpense: (id: number) => void;
};

const ExpenseItem = (props: Props) => {
  const { expense, deleteExpense } = props;
  return (
    <div key={expense.id} className="p-3 bg-blue-100 rounded-lg space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{expense.description}</p>
          <p className="text-sm text-gray-600">Paid by: {expense.paidBy}</p>
          <p className="text-sm text-gray-600">Category: {expense.category}</p>
          <p className="text-sm text-gray-600">{formatDate(expense.date)}</p>
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
  );
};

export default ExpenseItem;
