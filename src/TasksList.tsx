// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "./store";
// import { fetchTasksByBoard } from "./store/slices/tasksSlice";
// import type { Board } from "./types";

// const TasksList = () => {
//   const dispatch = useDispatch();

//   const { list, activeBoardID } = useSelector(
//     (state: RootState) => state.boards
//   );
//   const { byBoardID } = useSelector((state: RootState) => state.tasks);

//   const activeBoard: Board = list.find((board) => board.id === activeBoardID);

//   const tasks = byBoardID[activeBoardID] || [];

//   useEffect(() => {
//     if (activeBoard) {
//       dispatch(fetchTasksByBoard(activeBoard));
//     }
//   }, [dispatch, activeBoardID, activeBoard]);

//   return (
//     <div>
//       <h1>Tasks For {activeBoard.name}</h1>
//       <ul>
//         {tasks.map((curr) => {
//           return <li>{curr.title}</li>;
//         })}
//       </ul>
//     </div>
//   );
// };

// export default TasksList;
