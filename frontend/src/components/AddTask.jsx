import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { useState } from "react";

import { toast } from "sonner";
import api from "@/lib/axios";

const AddTask = ({ handleNewTaskAdded }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const addTask = async () => {
    if (newTaskTitle.startsWith(" ")) {
      return;
    }
    try {
      await api.post("/tasks", {
        title: newTaskTitle,
      });
      toast.success(`Nhiệm vụ ${newTaskTitle} đã được thêm vào`);
      handleNewTaskAdded();
    } catch (error) {
      console.log("lỗi xảy ra khi thêm nhiệm vụ", error);
      toast.error("lỗi xảy ra khi thêm nhiệm vụ mới");
    }
    setNewTaskTitle("");
  };
  const handleChange = (e) => {
    if (e.target.value.startsWith(" ")) {
      return;
    }

    setNewTaskTitle(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };
  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg ">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Cần phải làm gì?"
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          value={newTaskTitle}
          onChange={handleChange}
        />
        <Button
          variant="gradient"
          size="xl"
          className="px-6"
          onClick={addTask}
          onKeyPress={handleKeyPress}
          disabled={!newTaskTitle.trim()}>
          <Plus className="size-5" />
          Thêm
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;
