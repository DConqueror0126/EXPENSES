import React, { useEffect, useState } from 'react';
import { firebaseService } from '../../lib/firebaseService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { Spinner } from '../ui/Spinner';
import { Trash } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableCaption,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/Table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select'; // Import Select components from ShadCN

const ExpensesTab = () => {
  const { getExpenses, createExpense, deleteExpenses, updateExpense } = firebaseService();

  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(''); // State for month input
  const [selectedIds, setSelectedIds] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editMonth, setEditMonth] = useState(''); // State for editing month
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  useEffect(() => {
    const fetchExpenses = async () => {
      const data = await getExpenses();
      const unique = Array.from(new Map(data.map(item => [item.id, item])).values());
      setExpenses(unique);
    };
    fetchExpenses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddExpense = async () => {
    if (!description.trim() || !amount.trim() || !month.trim()) return; // Check if month is empty
    setIsLoading(true); // Set loading to true
    const newExpense = await createExpense({
      description,
      amount: parseFloat(amount),
      month, // Include month in the expense data
    });
    setExpenses(prev => [...prev, newExpense]);
    setDescription('');
    setAmount('');
    setMonth(''); // Reset month input
    setIsLoading(false); // Set loading to false
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    await deleteExpenses(selectedIds);
    setExpenses(prev => prev.filter(e => !selectedIds.includes(e.id)));
    setSelectedIds([]);
  };

  const handleStartEdit = (expense) => {
    setEditId(expense.id);
    setEditDescription(expense.description);
    setEditAmount(expense.amount);
    setEditMonth(expense.month); // Set month for editing
  };

  const handleSaveEdit = async () => {
    if (!editDescription.trim() || !editAmount.trim() || !editMonth.trim()) return; // Check if month is empty

    const updatedExpense = {
      description: editDescription,
      amount: parseFloat(editAmount),
      month: editMonth, // Include month in the updated expense data
    };

    await updateExpense(editId, updatedExpense);

    setExpenses(prev =>
      prev.map(exp =>
        exp.id === editId ? { ...exp, ...updatedExpense } : exp
      )
    );

    setEditId(null);
    setEditDescription('');
    setEditAmount('');
    setEditMonth(''); // Reset month input
  };

  return (
    <div>
      <Card className="w-full max-w-3xl mx-auto mt-4">
        <CardHeader className="justify-between flex flex-col md:flex-row">
          <div>
            <CardTitle>Expense List</CardTitle>
            <CardDescription>List of all your expenses</CardDescription>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add an expense"
            />
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <Select onValueChange={setMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddExpense} disabled={isLoading}>
              {isLoading ? <Spinner size="small" className='text-gray-50' /> : 'Add'} {/* Conditional rendering */}
            </Button>

            {selectedIds.length > 0 && (
                <Button variant="destructive" onClick={handleDeleteSelected}>
                <Trash />({selectedIds.length})
                </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Table className="w-full">
            <TableCaption>A list of your expenses.</TableCaption>
            <TableHeader className="m-0 p-0 ">
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={selectedIds.length === expenses.length && expenses.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds(expenses.map(exp => exp.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Month</TableHead> {/* Add month column */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map(expense => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(expense.id)}
                      onCheckedChange={() => toggleSelect(expense.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {editId === expense.id ? (
                      <Input
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                      />
                    ) : (
                      expense.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === expense.id ? (
                      <Input
                        type="number"
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                      />
                    ) : (
                      `₱${Number(expense.amount).toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === expense.id ? (
                      <Select value={editMonth} onValueChange={setEditMonth}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      expense.month
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === expense.id ? (
                      <Button size="sm" onClick={handleSaveEdit}>
                        Save
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleStartEdit(expense)}>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesTab;
