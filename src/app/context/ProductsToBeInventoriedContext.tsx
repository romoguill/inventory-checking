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
  payload: string;
};

type RemoveItem = {
  type: 'remove';
  payload: string;
};

type UpdateUser = {
  type: 'updateUser';
  payload: {
    productId: string;
    userId: string;
  };
};

type InventoryState = {
  productId: string;
  userId: string | null;
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
      if (state.find((item) => item.productId === action.payload)) {
        return state;
      }

      return [...state, { productId: action.payload, userId: null }];
    case 'remove':
      return state.filter((item) => item.productId !== action.payload);
    case 'updateUser':
      return state.map((item) => {
        if (item.productId === action.payload.productId) {
          return {
            productId: action.payload.productId,
            userId: action.payload.userId,
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
