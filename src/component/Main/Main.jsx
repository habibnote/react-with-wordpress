import React from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function Main() {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  );
}
