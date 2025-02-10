import { TExpense } from "@/ProjectType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { formatBalance } from "@/utils/utils";

type Props = {
  expenses: TExpense[];
  members: string[];
};

const SpendingStatistics = (props: Props) => {
  const { expenses, members } = props;
  const data = members.map((member) => {
    const totalSpent = expenses
      .filter((expense) => expense.paidBy === member)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

    return {
      name: member,
      amount: parseFloat(totalSpent.toFixed(2)),
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">{formatBalance(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, value } = props;
    return (
      <text
        x={x + 30}
        y={y - 10}
        fill="#374151"
        textAnchor="middle"
        fontSize="12"
      >
        {formatBalance(value)}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatBalance(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              >
                <LabelList content={<CustomLabel />} position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingStatistics;
