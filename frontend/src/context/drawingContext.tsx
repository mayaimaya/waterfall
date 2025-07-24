import { createContext, ReactNode, useState } from "react"

export interface DrawingContextType {
  enableDraw: boolean
  setEnableDraw: (value: boolean) => void
}

// Default value that throws an error if accessed outside provider
const defaultValue: DrawingContextType = {
  enableDraw: false,
  setEnableDraw: () => {
    throw new Error('Must use DrawingProvider to access setEnableDraw')
  },
}

export const DrawingContext = createContext<DrawingContextType>(defaultValue)

interface DrawingProviderProps {
  children: ReactNode;
  enableDraw: boolean;
  setEnableDraw: (value: boolean) => void;
}

export const DrawingProvider = ({
  children,
  enableDraw,
  setEnableDraw,
}: DrawingProviderProps) => {
  return (
    <DrawingContext.Provider value={{ enableDraw, setEnableDraw }}>
      {children}
    </DrawingContext.Provider>
  );
};