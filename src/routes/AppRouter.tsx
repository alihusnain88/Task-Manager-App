import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TasksGridView from "../views/TasksGridView";
// import TasksGridView from "../components/TasksGrid/TasksGridView";
import ProjectView from "../pages/ProjectView"; 
import TaskView from "../pages/TaskView";
import App from "../App";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TasksGridView />} />
        <Route path="/projects/:projectID" element={<ProjectView />} />
        <Route path="/tasks/:taskID" element={<TaskView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
