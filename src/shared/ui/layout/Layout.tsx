import React, { ReactNode } from "react";
import HeaderComponent from "./Header/Header";
export interface IChildren {
  children: ReactNode;
}
const LayoutComponent = ({ children }: IChildren) => {
  return (
    <>
      <HeaderComponent />
      {children}
      {/* <Footer /> */}
    </>
  );
};

export default LayoutComponent;
