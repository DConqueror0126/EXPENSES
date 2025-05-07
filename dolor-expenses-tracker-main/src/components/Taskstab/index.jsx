// src/components/TasksComponent.jsx
import React, { useEffect, useState } from 'react';
import { firebaseService } from '../../lib/firebaseService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableCaption,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/Table';

const TasksTab = () => {
  const { getTasks, createTask } = firebaseService();
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      const unique = Array.from(new Map(data.map(item => [item.id, item])).values());
      setTasks(unique);
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!input.trim()) return;
    const newTask = await createTask({ title: input });
    setTasks(prev => {
      const exists = prev.some(e => e.id === newTask.id);
      return exists ? prev : [...prev, newTask];
    });
    setInput('');
  };

  return (
    <div>
      <Card className="w-full max-w-3xl mx-auto mt-4">
        <CardHeader className="justify-between flex flex-col md:flex-row">
          <div>
            <CardTitle>Task List</CardTitle>
            <CardDescription>List of all your tasks</CardDescription>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Add a task"
            />
            <Button onClick={handleAddTask}>Add</Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table className="w-full">
            <TableCaption>A list of your tasks.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksTab;
