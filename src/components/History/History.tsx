import React from 'react'
import { ICart, ICartItem } from '../../types/types';
import { Wrapper } from './History.styles';




const History: React.FC<any> = ({ carts }) => {

  return (
    <Wrapper>
      <h2>Your History</h2>
    <table>
      <tr>
      <th>CartId</th>
      <th>product</th>
      <th>price</th>
      <th>Date</th>
      </tr>
 
  {carts.map((item:any) => {
    return[
      <tr>
      <td>{item.cartid}</td>
      <td>{(item.title)}</td>
      <td>{(item.price)}</td>
      <td>{(item.created)}</td>
      </tr>
    ]
  }
   
      )}

    
      </table>
      <h2>Total: {carts.length}</h2>
      <h2>Total Purchases: {carts.reduce((accumulator, obj:any) => { return accumulator + obj.price;},
  0)}</h2>
    </Wrapper>
  );
};

export default History;
