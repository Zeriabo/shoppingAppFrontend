export interface IProduct {
  id: number | undefined;
  title: string | undefined;
  price: number | undefined;
  category: string | undefined;
  description: string | undefined;
  image: string | undefined;
}
export interface IProductToAdd {
  id: number | undefined;
  title: string | undefined;
  price: number;
  discount: number;
  category: string | undefined;
  description: string | undefined;
  image: string | undefined;
  cartId: number;
}
export interface ICartDetails {
  id: number | undefined;
  title: string | undefined;
  price: number;
  total: number | undefined;
  category: string | undefined;
  description: string | undefined;
  quantity: number | any;
  image: string | undefined;
}

export interface ICartItem {
  id: number | undefined;
  title: string | undefined;
  price: number;
  totalPrice: number | 0;
  category: string | undefined;
  description: string | undefined;
  quantity: number | any;
  discount: number | any;
  image: string | undefined;
}

export interface IUser {
  id: number | undefined;
  name: string | undefined;
  email: string | undefined;
  image: string | undefined;
}
export type SearchProps = {
  productName: string;
  onClick?: Function;
};
export type ProductProps = {
  data: IProduct[];
};

export interface IGenericResponse {
  status: string;
  message: string;
}
export interface ICategories {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
}

export interface ICart {
  id: number | undefined;
  createdAt: string | undefined;
  updateAt: string | undefined;
  paid: boolean | undefined;
  userId: number | undefined;
}

export interface INotification {
  text: string | undefined;
  open: boolean;
  severity: "error" | "warning" | "info" | "success" | undefined;
}
export interface IFilteredProducts {
  products: IProduct[] | undefined;
  found: boolean;
}
