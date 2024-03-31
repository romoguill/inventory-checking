'use client';

import { Product } from '@prisma/client';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

export type TProductsToBeInventoriedProvider = {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
};

const Context = createContext<TProductsToBeInventoriedProvider | null>(null);

export const ProductsToBeInventoriedProvider = ({
  children,
}: PropsWithChildren) => {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <Context.Provider value={{ products, setProducts }}>
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
