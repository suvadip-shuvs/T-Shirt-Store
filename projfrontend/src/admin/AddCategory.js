import React, { useState } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";
import { createCategory } from "./helper/adminapicall";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  const goBack = () => (
    <div className="mt-3">
      <Link className="btn btn-md btn-warning mb-3" to="/admin/dashboard">
        Return to Admin Dashboard
      </Link>
    </div>
  );

  const handleChange = (event) => {
    setError("");
    setSuccess("");
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    //backend request fired
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setError("");
        setSuccess(true);
        setName("");
      }
    });
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category created successfully</h4>;
    }
  };

  const warningMessage = () => {
    if (error) {
      return <h4 className="text-danger">{error}</h4>;
    }
  };

  const myCategoryForm = () => (
    <form className="pt-3">
      <div className="form-group">
        <h3>Enter the category name:</h3>
        <input
          type="text"
          className="form-control my-3"
          required
          onChange={handleChange}
          value={name}
          autoFocus
          placeholder="Example Summer Collections"
        />
        <button onClick={onSubmit} className="btn btn-outline-success">
          Create
        </button>
      </div>
    </form>
  );
  return (
    <Base
      title="Add Category"
      description="Add a new category for you tshirts"
      className="container bg-success p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {warningMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
}
