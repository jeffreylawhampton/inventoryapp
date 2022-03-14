import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import config from "../../config";
import FormError from "../layout/FormError";
import FormLeft from "./FormLeft";

const SignInForm = () => {
  const [userPayload, setUserPayload] = useState({ email: "", password: "" });
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [errors, setErrors] = useState({});

  const validateInput = (payload) => {
    setErrors({});
    const { email, password } = payload;
    const emailRegexp = config.validation.email.regexp;
    let newErrors = {};
    if (!email.match(emailRegexp)) {
      newErrors = {
        ...newErrors,
        email: "is invalid",
      };
    }

    if (password.trim() === "") {
      newErrors = {
        ...newErrors,
        password: "is required",
      };
    }

    setErrors(newErrors);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    validateInput(userPayload);
    try {
      if (Object.keys(errors).length === 0) {
        const response = await fetch("/api/v1/user-sessions", {
          method: "post",
          body: JSON.stringify(userPayload),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
        });
        if (!response.ok) {
          const errorMessage = `${response.status} (${response.statusText})`;
          const error = new Error(errorMessage);
          throw error;
        }
        const userData = await response.json();
        setShouldRedirect(true);
      }
    } catch (err) {
      console.error(`Error in fetch: ${err.message}`);
    }
  };

  const onInputChange = (event) => {
    setUserPayload({
      ...userPayload,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  if (shouldRedirect) {
    window.location = "/";
  }
  return (
    <div className="authentication grid-x">
      <FormLeft />
      <div className="right cell small-12 medium-7">
        <div className="form-container">
          <h2>Sign in</h2>
          <form className="register" onSubmit={onSubmit}>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userPayload.email}
                onChange={onInputChange}
              />
              <FormError error={errors.email} />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userPayload.password}
                onChange={onInputChange}
              />
              <FormError error={errors.password} />
            </div>
            <div>
              <input type="submit" className="button" value="Sign In" />
            </div>
          </form>
          <h5>
            Don't have an account yet? <Link to="/users/new">Join now</Link>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
