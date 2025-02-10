import { TBill } from "@/ProjectType";
import { formatDateTime } from "@/utils/utils";
import { useNavigate } from "react-router";

type Props = {
  bill: TBill;
};

const BillItem = (props: Props) => {
  const { bill } = props;
  const navigate = useNavigate();

  const continueBill = (bill: TBill) => {
    navigate(`/${bill.id}`);
  };

  return (
    <div
      className={`p-3 rounded-lg cursor-pointer drop-shadow-sm ${
        bill.status === "completed" ? "bg-green-100" : "bg-blue-100"
      }`}
      onClick={() => continueBill(bill)}
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
              bill.status === "completed" ? "bg-green-400" : "bg-blue-400 "
            }`}
          >
            {bill.status === "completed" ? "Completed" : "Active"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillItem;
