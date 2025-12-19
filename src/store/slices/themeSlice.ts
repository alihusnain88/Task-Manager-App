import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface Themestate {
    mode: "dark" | "light"
}

const initialState = {
    mode: "dark"
}
const themeSlice =  createSlice(
    {
        name: "theme",
        initialState,
        reducers: {
            setMode: (state, action: PayloadAction<"dark" | "light">) => (
                state.mode = action.payload
            ),
            toggleMode: (state) => {
                state.mode = state.mode === "dark" ? "light" : "dark"
            }
        }
    }
)

export const {setMode, toggleMode} = themeSlice.actions
export default themeSlice.reducer