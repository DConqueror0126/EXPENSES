// src/components/PlansTab.jsx
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

const PlansTab = () => {
  const { getPlans, createPlan, deletePlans, updatePlan } = firebaseService();

  const [plans, setPlans] = useState([]);
  const [goal, setGoal] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editGoal, setEditGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      const data = await getPlans();
      const unique = Array.from(new Map(data.map(item => [item.id, item])).values());
      setPlans(unique);
    };
    fetchPlans();
  }, []);

  const handleAddPlan = async () => {
    if (!goal.trim()) return;
    setIsLoading(true);
    const newPlan = await createPlan({ goal });
    setPlans(prev => [...prev, newPlan]);
    setGoal('');
    setIsLoading(false);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    await deletePlans(selectedIds);
    setPlans(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  const handleStartEdit = (plan) => {
    setEditId(plan.id);
    setEditGoal(plan.goal);
  };

  const handleSaveEdit = async () => {
    if (!editGoal.trim()) return;

    const updatedPlan = { goal: editGoal };
    await updatePlan(editId, updatedPlan);

    setPlans(prev =>
      prev.map(plan => (plan.id === editId ? { ...plan, ...updatedPlan } : plan))
    );

    setEditId(null);
    setEditGoal('');
  };

  return (
    <div>
      <Card className="w-full max-w-3xl mx-auto mt-4">
        <CardHeader className="justify-between flex flex-col md:flex-row">
          <div>
            <CardTitle>Planner</CardTitle>
            <CardDescription>Manage your personal goals and plans</CardDescription>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="Add a new plan"
            />
            <Button onClick={handleAddPlan} disabled={isLoading}>
              {isLoading ? <Spinner size="small" className='text-white' /> : 'Add'}
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
            <TableCaption>A list of your plans.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={selectedIds.length === plans.length && plans.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds(plans.map(p => p.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map(plan => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(plan.id)}
                      onCheckedChange={() => toggleSelect(plan.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {editId === plan.id ? (
                      <Input
                        value={editGoal}
                        onChange={e => setEditGoal(e.target.value)}
                      />
                    ) : (
                      plan.goal
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === plan.id ? (
                      <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                    ) : (
                      <Button size="sm" onClick={() => handleStartEdit(plan)}>Edit</Button>
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

export default PlansTab;
