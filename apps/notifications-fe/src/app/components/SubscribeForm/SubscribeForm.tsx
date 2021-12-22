import React from "react";
import { Field, Form, FormikBag, FormikProps, withFormik } from "formik";
import { Select, TextField as FormikTextField } from "formik-mui";
import { Box, Button, MenuItem } from "@mui/material";
import FieldGroup from "../FieldGroup/FieldGroup";
import axios from "axios";

export interface FormProps {
  onSubscriptionAdded: (errors?: string[]) => void;
}

export interface FormModel {
  email: string;
  interval: "immediate" | "5min" | "10min";
}

const isEmailValid = (e: string) => {
  return e.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

const SubscribeForm: React.FC<FormProps & FormikProps<FormModel>> = () => {
  return (
    <Form noValidate>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        minWidth: "240px"
      }}>
        <FieldGroup>
          <Field
            component={FormikTextField}
            name="email"
            label="Email"
            required
            type="email"
          />
        </FieldGroup>
        <FieldGroup>
          <Field
            component={Select}
            name="interval"
            label="Interval"
            required
          >
            {/* Intervals could be loaded from backend */}
            <MenuItem value="immediate">Immediate</MenuItem>
            <MenuItem value="5min">5 minutes</MenuItem>
            <MenuItem value="10min">10 minutes</MenuItem>
          </Field>
        </FieldGroup>
        <Button type="submit" variant="contained" color="primary" size="large">
          Subscribe
        </Button>
      </Box>
    </Form>
  );
};

export default withFormik({
  mapPropsToValues: () => ({
    email: "",
    interval: "immediate"
  } as FormModel),
  handleSubmit: async (values: FormModel, bag: FormikBag<FormProps, FormModel>) => {
    try {
      await axios.post("http://localhost:3333/api/subscriptions", values);
      bag.props.onSubscriptionAdded();
    } catch (err: any) {
      bag.props.onSubscriptionAdded(err.response.data);
    }
  },
  validate: (values: FormModel) => {
    const errors: Partial<{ [index in keyof FormModel]: string }> = {};
    if (!values.email) {
      errors.email = "Email is required";
    }
    if (values.email && !isEmailValid(values.email)) {
      errors.email = "Email value is not valid";
    }
    return errors;
  }
})(SubscribeForm);
