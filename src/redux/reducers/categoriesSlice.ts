import {
  createAsyncThunk,
  createSlice,
  current,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../app/store";
import { ICategories } from "../../types/types";
import axios from "axios";

export interface CategoriesState {
  categories: ICategories[];
  status: "idle" | "loading" | "failed" | "fullfilled";
}

const initialState: CategoriesState = {
  categories: [],
  status: "idle",
};
export const fetchCategories: any = createAsyncThunk(
  "getCategories",
  async () => {
    const response = await fetch(
      "https://zshopping-backend.herokuapp.com/api/v1/category",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    if (response.status === 201) {
      const res = await response.json();
      return res.body.result;
    }
  }
);

export const categoriesSlice = createSlice({
  name: "categorySlice",
  initialState: initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.categories = [];
      state.status = "loading";
    });
    builder.addCase(fetchCategories.rejected, (state) => {
      state.categories = [];
      state.status = "failed";
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.status = "fullfilled";
      state.categories = action.payload;

      return state;
    });

    builder.addDefaultCase(() => {});
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCategoryItems = (state: CategoriesState) => state.categories;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const {} = categoriesSlice.actions;
export default categoriesSlice.reducer;
