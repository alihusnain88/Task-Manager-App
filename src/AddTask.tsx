// import { Button, Container, TextField } from '@mui/material'
// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import type { RootState } from './store'
// import { type Task } from './types'
// import {addTask} from './store/slices/tasksSlice'

// const AddTask = () => {
//     const dispatch = useDispatch()
//     const [title, setTitle] = useState<string>("")
//     const [status, setStatus] = useState<"backlog"|"completed">("backlog")
//     const [task, setTask] = useState<Task | null>(null)
//     const {activeBoardID} = useSelector(
//         (state: RootState) => state.boards
//     )

//     const handleSave = () => {
//         const newTask = {boardID: activeBoardID, task: {id: 1, title, status, tags:[], background: null}}
//         dispatch(addTask(newTask))
//     }

//   return (
//     <Container>
//         <TextField label='Add Task Title' value={title} onChange={((e)=>setTitle(e.target.value))}/>
//         <Button onClick={()=>handleSave()}>Save</Button>
//     </Container>
//   )
// }

// export default AddTask