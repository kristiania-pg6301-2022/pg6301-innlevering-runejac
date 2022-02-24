import { Link, Route, Routes } from "react-router-dom";
import React from "react";

export const ShowAnswer = () => {
  return (
    <div className={"show-answer-div"}>
      <Routes>
        <Route
          path={"correct"}
          element={<h1 className={"correct-or-wrong-txt"}>✅ Correct!</h1>}
        />
        <Route
          path={"wrong"}
          element={<h1 className={"correct-or-wrong-txt"}>❌ Wrong</h1>}
        />
      </Routes>
      <ul className={"ul"}>
        <li>
          <Link className={"home"} to={"/question"}>
            More questions
          </Link>
        </li>
        <li>
          <Link className={"home"} to={"/"}>
            Home
          </Link>
        </li>
      </ul>
    </div>
  );
};
