import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { getCategories, createProduct } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";
import swal from "sweetalert";

export default function AddProduct() {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getaRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getaRedirect,
    formData,
  } = values;

  const preload = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
        console.log(categories);
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true, createdProduct: "" });
    setTimeout(() => {
      createProduct(user._id, token, formData).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, createdProduct: "" });
          const err = data.error;
          console.log(err);
          swal({
            title: "Oops!",
            text: `${err}`,
            icon: "error",
            button: "OK",
          });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            stock: "",
            photo: "",
            loading: false,
            error: "",
            formData: new FormData(),
            createdProduct: data.name,
          });
          swal("Success", "Product Added Successfully", "success");
        }
      });
    }, 3000);
  };

  // const successMessage = () => {
  //   if (createdProduct) {
  //     return swal("Success", "Product Added Successfully", "success");
  //   }
  // };

  // const warningMessage = () => {
  //   if (error) {
  //     return swal("Oops", {error}, "error");
  //   }
  // };

  const createProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="name"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          className="form-control"
          name="description"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          name="price"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          name="category"
          placeholder="Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((cate, index) => (
              <option key={index} value={cate._id}>
                {cate.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          name="stock"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      {loading ? (
        <button class="btn btn-primary btn-lg mb-3" disabled>
          <span class="spinner-grow spinner-grow-md mr-1"></span>
          Loading..
        </button>
      ) : (
        <button
          type="submit"
          onClick={onSubmit}
          className="btn btn-lg btn-success mb-3"
        >
          Create Product
        </button>
      )}
    </form>
  );

  return (
    <Base
      title="Add a product here!"
      description="Welcome to product creation section"
      className="container bg-success p-4 mt--3"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-warning mb-3">
        Back to Admin Dashboard
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {/* {warningMessage()}
          {successMessage()} */}
          {createProductForm()}
        </div>
      </div>
    </Base>
  );
}
