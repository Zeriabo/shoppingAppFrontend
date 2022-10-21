import {
  createAsyncThunk,
  createSlice,
  current,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../app/store";
import { IProduct, IUser } from "../../types/types";
import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle";
import { elementTypeAcceptingRef } from "@mui/utils";
import logger from "redux-logger";

export interface ProductsState {
  products: IProduct[];
  filteredProducts: IProduct[];
  likedProducts: IProduct[];
  status: "idle" | "loading" | "failed" | "fullfilled";
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  likedProducts: [],
  status: "idle",
};
var untouch: any = [];

export const fetchProducts: any = createAsyncThunk("getProducts", async () => {
  const response = await fetch(
    "https://zshopping-backend.herokuapp.com/api/v1/products/",
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
});

export const fetchProduct = createAsyncThunk(
  "fetchproduct",
  async (id: string) => {
    const response = await fetch(
      process.env.REACT_APP_SERVER_URL + `/products/${id}`
    );
    const result = await response.json();
    return result;
  }
);
export const deleteProductAsync = createAsyncThunk(
  "deleteProduct",
  async (productId: string) => {
    try {
      const data = await fetch(`https://api`, {
        method: "DELETE",
      });
      const result = await data.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
);
export const productsSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    addProduct(state, action: PayloadAction<IProduct>) {
      state.products.push(action.payload);
    },
    removeProduct(state, action) {
      state.products.filter((element) => element.category != action.payload) ||
        state.products.filter((element) => element.title != action.payload) ||
        state.products.filter((element) => element.id != action.payload) ||
        state.products.filter(
          (element) => element.description != action.payload
        ) ||
        state.products.filter((element) => element.price != action.payload);
    },
    loadProducts(state, action) {
      action.payload.forEach((element: any) => {
        var productToPush: IProduct = {
          id: 0,
          category: "",
          description: "",
          image: "",
          price: 0,
          title: "",
        };
        productToPush.category = element.category;
        productToPush.title = element.title;
        productToPush.price = element.price;
        productToPush.category = element.category;
        productToPush.description = element.description;
        productToPush.image = element.image;
        productToPush.id = element.id;

        state.products.push(productToPush);
      });
      state.products = action.payload;
    },
    searchProduct(state, action) {
      if (action.payload != "") {
        return {
          ...state,
          filteredProducts: state.products.filter(
            (foundProduct: any) =>
              foundProduct.description.includes(action.payload) ||
              foundProduct.title.includes(action.payload)
          ),
        };
      } else {
        return {
          ...state,
          products: untouch,
        };
      }
    },
    filterProducts(state, action) {
      if (action.payload != "") {
        return {
          ...state,
          filteredProducts: state.products.filter(
            (foundProduct) => foundProduct.category == action.payload
          ),
        };
      } else {
        return {
          ...state,
          products: untouch,
        };
      }
    },
    resetfilterProducts(state) {
      return {
        ...state,
        filteredProducts: state.products,
      };
    },
    likeUnlikeProduct(state, action) {
      console.log(action.payload);
      const found = state.likedProducts.filter(function (obj) {
        if (obj.id === action.payload.id) {
          return true;
        }
        return false;
      });
      console.log(found);
      if (found.length == 0) {
        return {
          ...state,
          likedProducts: [...state.likedProducts, action.payload],
        };
      } else {
        return {
          ...state,
          likedProducts: state.likedProducts.filter((product) => {
            return product.id != action.payload.id;
          }),
        };
      }
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state, action) => {
      state.products = [];
      state.filteredProducts = [];
      state.status = "loading";
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.products = [];
      state.filteredProducts = [];
      state.status = "failed";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = "fullfilled";

      state.products = [...action.payload];
      untouch = state.products;
      return state;
    });
    builder.addCase(
      deleteProductAsync.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.products = state.products.filter(
          (product: { id: any }) => product.id !== action.payload
        );
      }
    );

    builder.addDefaultCase((state, action) => {});
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectProductDesc = (state: ProductsState) => state.products;
// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const {
  addProduct,
  removeProduct,
  loadProducts,
  searchProduct,
  filterProducts,
  likeUnlikeProduct,
  resetfilterProducts,
} = productsSlice.actions;
export default productsSlice.reducer;
