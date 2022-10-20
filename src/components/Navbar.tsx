import { Badge, Drawer } from "@material-ui/core";
import { Search, ShoppingCartOutlined } from "@material-ui/icons";
import axios, { AxiosResponse } from "axios";
import React, {  useEffect, useState } from "react";
import { config } from "dotenv";
import { useSelector,useDispatch } from 'react-redux';
import styled from "styled-components";
import { RootState } from "../redux/app/store";
import { mobile } from "../responsive";
import { checkUserCart, fetchUser, getHistory, loginUser, logout, signin, signOut } from "../redux/reducers/userSlice";
import { ICartItem ,IProductToAdd, IUser} from "../types/types";
import Cart from "./Cart/Cart";
import History from "./History/History"
import { Avatar, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import { addProduct, addProductToCartDetails, checkOut, empty, removeProduct, removeProductFromCartDetails } from "../redux/reducers/cartDetailsSlice";
import HistoryIcon from '@mui/icons-material/History';
import { searchProduct } from "../redux/reducers/productsSlice";
import {Link} from 'react-scroll'
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';

const Container = styled.div`
  height: 60px;
  ${mobile({ height: "50px" })}
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "10px 0px" })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Language = styled.span`
  font-size: 14px;
  cursor: pointer;
  ${mobile({ display: "none" })}
`;

const SearchContainer = styled.div`
  border: 0.5px solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
`;

const Input = styled.input`
  border: none;
  ${mobile({ width: "50px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  ${mobile({ fontSize: "24px" })}
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;
interface AuthResponse {
  token: string;
  user: IUser;
}
const inputProps = {
  step: 300,
};
const Navbar = () => {
  const dispatch = useDispatch();
  const [cartOpen, setCartOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as ICartItem[]);
  const userState=useSelector((state:RootState)=>state.rootReducer.user); 
  const cart=useSelector((state:RootState)=>state.rootReducer.cartDetails); 
  const products=useSelector((state:RootState)=>state.rootReducer.products.products);
  let history= useSelector((state:RootState)=>state.rootReducer.user.history);
  useEffect(() => {
    function start() {
    gapi.client.init({
    clientId : "797646089844-ogvj7dpqn4ma2eunjmojiu0r5mfdcuse.apps.googleusercontent.com",
    scope : 'profile'
    })
    };
    gapi.load('client:auth2',start);
    });

   const signout= ()=>{
    dispatch(signOut());
  } 

const search=(text:any)=>{
 dispatch(searchProduct(text))
}
const responseSuccessGoogle = async (res: any) => {
  const profile= res.profileObj;
  const token = res.tokenId;
  var loggedUser = {
    profile,
    token
  }
  try {
   await dispatch(loginUser(loggedUser))
   await dispatch(checkUserCart(loggedUser.profile))
    
  } catch (err:any) {
    console.log(err);
    

  }
};
const responseFailureGoofle = async(err:any)=>{
  console.log(err)
   
}
  return (
    <Container>
    <Wrapper>
  
      <Left>
        <Language>EN</Language>
        <SearchContainer>
         <TextField id="search" type="text"  />
         <Link to="products" spy={true} smooth={true}>     
          <SearchIcon onClick={()=>search(document.getElementById("search").value)} sx={{ "&:hover": { cursor: "pointer" } }}/></Link>
        </SearchContainer>
      </Left>
      <Center>
        <Logo>ZShopping</Logo>
      </Center>
        {(userState.user.id!=undefined)? 
          <Avatar
        alt={userState.user.name}
        src={userState.user.image}
        sx={{ width: 56, height: 56 }}
      
      />
      : 

      <GoogleLogin
      clientId="797646089844-ogvj7dpqn4ma2eunjmojiu0r5mfdcuse.apps.googleusercontent.com"
      onSuccess={responseSuccessGoogle}
      onFailure={responseFailureGoofle}
      cookiePolicy={'single_host_origin'}
      scope="profile"

    />
   
 }
       {(userState.user.id!=undefined)? <MenuItem onClick={()=>signout()}>LOGOUT</MenuItem>  :null }
       {(userState.user.id!=undefined)?      <MenuItem onClick={()=>  dispatch(getHistory(userState.cart.userId))}>
   <Drawer anchor='right' open={historyOpen}  onClose={() => setHistoryOpen(false)}>
  {(history.length>0)?  <History carts={history}           />:null}
      
       </Drawer>

       <Badge badgeContent={(history!=null)?history.length:0} color="primary" onClick={() => setHistoryOpen(true)}>
            <HistoryIcon />
          </Badge>
        </MenuItem> :null }





       {(userState.user.id!=undefined)?      <MenuItem>
 
   <Drawer anchor='right' open={cartOpen}  onClose={() => setCartOpen(false)} >
        <Cart 
              cartTotal={cart.total} addToCart={function (clickedItem: any): void {
                var productToadd: IProductToAdd = {
                  id: clickedItem.id,
                  title: clickedItem.title,
                  price: clickedItem.price,
                  discount: clickedItem.discount,
                  category: clickedItem.category,
                  description: clickedItem.description,
                  image: clickedItem.image,
                  cartId: userState.cart.id
                };
                dispatch(addProduct(productToadd));
                dispatch(addProductToCartDetails(productToadd));
              } } removeFromCart={function (clickedItem: ICartItem): void {
                var productToRemove: IProductToAdd = {
                  id: clickedItem.id,
                  title: clickedItem.title,
                  price: clickedItem.price,
                  discount: clickedItem.discount,
                  category: clickedItem.category,
                  description: clickedItem.description,
                  image: clickedItem.image,
                  cartId: userState.cart.id
                };
                dispatch(removeProduct(productToRemove));
                dispatch(removeProductFromCartDetails(productToRemove));
              } } cartItems={cart.cartItems} checkOut={function (): void {
                dispatch(checkOut(userState.cart.id))
                dispatch(empty())
              } }   />
              
       </Drawer>

       <Badge badgeContent={cart.cartItems.length} color="primary" onClick={() => setCartOpen(true)}>
            <ShoppingCartOutlined />
          </Badge>
        </MenuItem> :null }
   
   
    </Wrapper>
 
  </Container>
  
  );
};
export default Navbar;