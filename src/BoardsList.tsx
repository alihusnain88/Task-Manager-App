// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchBoards, setActiveBoardID } from "./store/slices/boardsSlice";
// import type { RootState, AppDispatch } from "./store";

// const BoardsList: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { list, activeBoardID, loading, error } = useSelector(
//     (state: RootState) => state.boards
//   );

//   useEffect(() => {
//     dispatch(fetchBoards());
//   }, [dispatch]);

//   if (loading) return <p>Loading boards...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div>
//       <h2>Boards</h2>
//       <ul>
//         {list.map(board => (
//           <li
//             key={board.id}
//             style={{
//               fontWeight: board.id === activeBoardID ? "bold" : "normal",
//               cursor: "pointer",
//             }}
//             onClick={() => dispatch(setActiveBoardID(board.id))}
//           >
//             {board.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   ); 
// };

// export default BoardsList;
