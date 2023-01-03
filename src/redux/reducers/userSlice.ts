/*eslint no-unused-expressions: "error"*/
import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Reducer,
} from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../app/store";
import { IUser } from "../../types/types";
import { elementTypeAcceptingRef } from "@mui/utils";
import axios from "axios";
import { useAppDispatch } from "../app/hooks";
import { fetchCartDetails } from "./cartDetailsSlice";
import { useDispatch } from "react-redux";

export interface UsersState {
  user: IUser;
  loading: "idle" | "pending" | "succeeded" | "failed";
  cart: any;
  history: any;
}
const initialState: UsersState = {
  user: {
    id: undefined,
    name: undefined,
    email: undefined,
    image: undefined,
  },
  loading: "idle",
  cart: {},
  history: {},
};

export const loginUser: any = createAsyncThunk(
  "users/login",
  async (loggedUser: any) => {
    const response = await axios.post(
      "https://zshoppingbackend.onrender.com/api/v1/users/login",
      {
        user: loggedUser,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    return response.data;
  }
);

export const signOut: any = createAsyncThunk("users/logout", async () => {
  const response = await axios.get(
    "https://zshoppingbackend.onrender.com/api/v1/users/logout"
  );
  return response.data;
});
export const fetchUser: any = createAsyncThunk("users/getUser", async () => {
  const userObj: IUser = {
    id: undefined,
    name: undefined,
    email: undefined,
    image: undefined,
  };
  const response = await fetch(
    "https://zshoppingbackend.onrender.com/api/v1/users/login/success",
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

  if (response.status === 200) {
    const res = await response.json();

    for (let key of Object.keys(res.cookies)) {
      var myobj = JSON.parse(res.cookies[key]);
      if (myobj.passport.user) {
        userObj.image = myobj.passport.user.avatar;
        userObj.name = myobj.passport.user.name;
        userObj.id = Number(myobj.passport.user.id);
        userObj.email = myobj.passport.user.email;
      }
    }
  }
  return userObj;
});

export const getHistory: any = createAsyncThunk(
  "users/getHistory",
  async (userId: any) => {
    const response: any = await fetch(
      "https://zshoppingbackend.onrender.com/api/v1/carts/paid/" + userId
    );
    const res = await response.json();
    return res;
  }
);

//end of fetch User
export const checkUserCart: any = createAsyncThunk(
  "users/checkUserCart",
  async (user: IUser) => {
    var userId = null;
    var cart: any = null;
    const gettingUserID = axios
      .get(
        "https://zshoppingbackend.onrender.com/api/v1/users/get/" + user.email
      )
      .then((response: any) => {
        if (response.data.body.result[0].email == user.email) {
          var userId = response.data.body.result[0].id;

          return userId;
        } else {
          //user is not in user table and doesn't have a cart
          axios
            .post("https://zshoppingbackend.onrender.com/api/v1/users/", {
              body: user,
            })
            .then((res: any) => console.log(res));
        }
      })
      .catch((err) => console.log(err));

    userId = await gettingUserID;

    if (userId > 0) {
      const cartApi = await axios.get(
        "https://zshoppingbackend.onrender.com/api/v1/carts/user/" + userId
      );
      if (cartApi.data[0] != undefined) {
        return cartApi.data[0];
      } else {
        axios
          .post("https://zshoppingbackend.onrender.com/api/v1/users/", {
            user,
          })
          .then((res) => res)
          .catch((err) => console.log(err));
        axios
          .post("https://zshoppingbackend.onrender.com/api/v1/carts/", {
            userId: user.id,
          })
          .then((res) => res)
          .catch((err) => console.log(err));
        const cartApi = await axios.get(
          "https://zshoppingbackend.onrender.com/api/v1/carts/user/",
          { params: { userId: userId } }
        );
        return cartApi.data[0];
      }
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    signin(state, action: PayloadAction<IUser>) {
      if (action.payload.id != undefined) {
        state.user = action.payload;
        state.loading = "succeeded";
      }
    },
    logout(state, action: PayloadAction<IUser>) {
      state.user = {
        id: undefined,
        name: undefined,
        email: undefined,
        image: undefined,
      };
      state.loading = "idle";
      state.cart = null;
    },
    loadUser(state, action) {
      if (action.payload.id != undefined) {
        state.user.id = action.payload.id;
        state.user.image = action.payload.image;
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
      }
      state.loading = "succeeded";
    },
    getUser: (state, action) => {
      return (state = { ...state });
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = "pending";
      state.user = {
        id: undefined,
        name: undefined,
        email: undefined,
        image: undefined,
      };
    }),
      builder.addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = "succeeded";
          state.user = action.payload;
        }
      ),
      builder.addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = "succeeded";
          state.user.email = action.payload.email;
          state.user.id = action.payload.googleId;
          state.user.image = action.payload.imageUrl;
          state.user.name = action.payload.name;
        }
      ),
      builder.addCase(signOut.fulfilled, (state, action) => {
        state.loading = "idle";
        state.cart = undefined;
        state.history = initialState.history;
        state.user = initialState.user;
      }),
      builder.addCase(fetchUser.rejected, (state) => {
        state.loading = "failed";
      });
    //cartChecked
    builder.addCase(checkUserCart.pending, (state) => {
      state.loading = "pending";
      state.user = {
        id: undefined,
        name: undefined,
        email: undefined,
        image: undefined,
      };
    }),
      builder.addCase(
        checkUserCart.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.cart = action.payload;
        }
      ),
      builder.addCase(checkUserCart.rejected, (state, action) => {
        state.cart = null;
      }),
      builder.addCase(
        getHistory.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.history = action.payload;
        }
      ),
      builder.addCase(getHistory.rejected, (state, action) => {
        state.history = null;
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state: UsersState) => state.user;
// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const { signin, loadUser, logout } = userSlice.actions;
export default userSlice.reducer;
