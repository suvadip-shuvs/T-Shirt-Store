import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import {
  getCategories,
  updateProduct,
  getProduct,
} from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";
import swal from "sweetalert";

export default function UpdateProduct({ match }) {
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
    didRedirect: false,
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
    didRedirect,
    formData,
  } = values;

  const preloadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ categories: data, formData: new FormData() });
        console.log(categories);
      }
    });
  };

  const preload = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        preloadCategories();
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category._id,
          formData: new FormData(),
        });
      }
    });
  };

  useEffect(() => {
    preload(match.params.productId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const performRedirect = () => {
    if (didRedirect) {
      return <Redirect to="/admin/products" />;
    }
  };
  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    setTimeout(() => {
      updateProduct(match.params.productId, user._id, token, formData).then(
        (data) => {
          if (data.error) {
            setValues({ ...values, error: data.error });
            const err = data.error;
            console.log(err);
            swal({
              title: "Oops!",
              text: `${err}`,
              icon: "error",
              button: "OK",
            });
          } else {
            setValues({ didRedirect: true });
            swal("Success", "Product Updated Successfully", "success");
          }
        }
      );
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

  const updateProductForm = () => (
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
          value={category}
        >
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
        <button className="btn btn-primary btn-lg mb-3" disabled>
          <span className="spinner-grow spinner-grow-md mr-1"></span>
          Loading..
        </button>
      ) : (
        <button
          type="submit"
          onClick={onSubmit}
          className="btn btn-lg btn-success mb-3"
        >
          Update Product
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
          {updateProductForm()}
          {performRedirect()}
          {JSON.stringify(values)}
        </div>
      </div>
    </Base>
  );
}
