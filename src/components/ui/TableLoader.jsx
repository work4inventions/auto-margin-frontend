import React from "react";
import Loader from "../common/Loader";

const TableLoader = ({ label }) => (
  <div className="table-loader">
    <Loader size="md" label={label} />
  </div>
);

export default TableLoader;
