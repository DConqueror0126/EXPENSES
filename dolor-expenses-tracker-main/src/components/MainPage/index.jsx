/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ExpensesTab from "../ExpensesTab";
import PlansTab from "../PlansTab";
import TasksTab from "../Taskstab";
import { Button } from "../ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/Drawer";

const tabs = [
  { label: "Tasks", content: <TasksTab /> },
  { label: "Expenses", content: <ExpensesTab /> },
  { label: "Plans", content: <PlansTab /> },
];

const OpenDrawerButton = ({ activeTab, setActiveTab, direction, setDirection }) => {
  const changeTab = (newIndex) => {
    setDirection(newIndex > activeTab ? 1 : -1);
    setActiveTab(newIndex);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Table Editor</Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] overflow-y-auto"> {/* Make DrawerContent scrollable */}
        <div className="mx-auto w-full max-w-3xl h-fit z-50">
          <DrawerHeader>
            <DrawerTitle>Tables</DrawerTitle>
            <DrawerDescription>Switch between your data views</DrawerDescription>
          </DrawerHeader>

          {/* Nav Buttons */}
          <div className="flex justify-center gap-4 px-4">
            {tabs.map((tab, index) => (
              <Button
                key={tab.label}
                onClick={() => changeTab(index)}
                variant={activeTab === index ? "default" : "outline"}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="relative w-full px-4 mt-4">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={activeTab}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {tabs[activeTab].content}
              </motion.div>
            </AnimatePresence>
          </div>

          <DrawerFooter className="border-t-2 border-gray-200">
            <DrawerClose className="z-20" asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default function MainPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <OpenDrawerButton
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          direction={direction}
          setDirection={setDirection}
        />
      </div>
    </>
  );
}

