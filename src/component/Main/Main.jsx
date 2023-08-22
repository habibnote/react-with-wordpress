import React from "react";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

export default function Main() {
  return (
    <div>
      <Header></Header>
      <Outlet></Outlet>
    </div>
  );
}
