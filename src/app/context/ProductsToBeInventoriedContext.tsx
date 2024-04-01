'use client';

import { Product } from '@prisma/client';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useReducer,
  useState,
} from 'react';

export type TProductsToBeInventoriedProvider = {
  products: Product[];
  dispatch: Dispatch<AddAction | RemoveAction>;
};

const Context = createContext<TProductsToBeInventoriedProvider | null>(null);

type AddAction = {
  type: 'add';
  payload: Product;
};

type RemoveAction = {
  type: 'remove';
  payload: string;
};

const reducer = (products: Product[], action: AddAction | RemoveAction) => {
  if (action.type === 'add') {
    if (!products.find((product) => action.payload.id === product.id)) {
      return [...products, action.payload];
    }

    return products;
  } else if (action.type === 'remove') {
    return products.filter((product) => product.id !== action.payload);
  }

  return products;
};

export const ProductsToBeInventoriedProvider = ({
  children,
}: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <Context.Provider value={{ products: state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export const useProductsToBeInventoriedContext = () => {
  const productContext = useContext(Context);

  if (!productContext) {
    throw new Error(
      'useProductsToBeInventoriedContext must be used inside a ProductsToBeInventoriedProvider'
    );
  }

  return productContext;
};
