import { BillStatus, TExpense } from "@/ProjectType";
import { formatBalance, formatDate } from "@/utils/utils";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  expense: TExpense;
  deleteExpense: (id: number) => void;
  billStatus: BillStatus;
};

const ExpenseItem = (props: Props) => {
  const { expense, deleteExpense, billStatus } = props;
  return (
    <div
      className={`p-3 rounded-lg space-y-2 ${
        billStatus === BillStatus.Completed ? "bg-green-100" : "bg-blue-100"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{expense.description}</p>
          <p className="text-sm text-gray-600">
            Paid by: <span className="font-bold">{expense.paidBy}</span>
          </p>
          <p className="text-sm text-gray-600">
            Category: <span className="font-bold">{expense.category}</span>
          </p>
          <p className="text-sm text-gray-600">{formatDate(expense.date)}</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-medium">
            {formatBalance(parseFloat(expense.amount))}
          </span>
          <AlertDialog>
            <AlertDialogTrigger>
              {billStatus === BillStatus.Active && (
                <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer" />
              )}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white shadow-lg rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete this expense of{" "}
                  <span className="font-medium text-yellow-800">
                    {" "}
                    {formatBalance(parseFloat(expense.amount))} paid by{" "}
                    {expense.paidBy}.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer hover:bg-gray-100">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteExpense(expense.id)}
                  className="bg-red-500 hover:bg-red-600 cursor-pointer text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
