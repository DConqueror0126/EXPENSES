import MainPage from "../MainPage";
import ExpensesAndamount from "../ExpensesAndamount";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-sm">
        <ExpensesAndamount />
        <MainPage />
      </div>
    </div>
  );
}