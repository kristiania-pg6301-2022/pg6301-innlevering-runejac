import { Link } from "react-router-dom";
import React from "react";

export function Home() {
  return (
    <div>
      <Link className={"home"} to={"/"}>
        Home
      </Link>
    </div>
  );
}
