'use client';

import { Product, User } from '@prisma/client';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useReducer,
  useState,
} from 'react';

type AddItem = {
  type: 'add';
  payload: Product;
};

type RemoveItem = {
  type: 'remove';
  payload: string;
};

type UpdateUser = {
  type: 'updateUser';
  payload: {
    productId: string;
    user: Pick<User, 'id' | 'name' | 'email' | 'role' | 'image'>;
  };
};

export type InventoryState = {
  product: Product;
  user: Pick<User, 'id' | 'name' | 'email' | 'role' | 'image'> | null;
}[];

export type TInventoryCreationContext = {
  inventoryItems: InventoryState;
  dispatch: Dispatch<AddItem | RemoveItem | UpdateUser>;
};

const Context = createContext<TInventoryCreationContext | null>(null);

const reducer = (
  state: InventoryState,
  action: AddItem | RemoveItem | UpdateUser
): InventoryState => {
  switch (action.type) {
    case 'add':
      if (state.find((item) => item.product === action.payload)) {
        return state;
      }

      return [...state, { product: action.payload, user: null }];
    case 'remove':
      return state.filter((item) => item.product.id !== action.payload);
    case 'updateUser':
      return state.map((item) => {
        if (item.product.id === action.payload.productId) {
          return {
            product: item.product,
            user: action.payload.user,
          };
        } else {
          return item;
        }
      });
    default:
      return state;
  }
};

export const InventoryCreationContext = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <Context.Provider value={{ inventoryItems: state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export const useProductsToBeInventoriedContext = () => {
  const productContext = useContext(Context);

  if (!productContext) {
    throw new Error(
      'useProductsToBeInventoriedContext must be used inside a InventoryCreationContext'
    );
  }

  return productContext;
};
