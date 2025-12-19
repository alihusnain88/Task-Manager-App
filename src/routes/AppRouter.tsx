import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TasksGridView from "../views/TasksGridView";
import ProjectView from "../pages/ProjectView"; 
import TaskView from "../pages/TaskView";
import App from "../App";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects/:projectID" element={<ProjectView />} />
        <Route path="/tasks/:taskID" element={<TaskView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
