'use strict'
/**
 * The Password reset form is the default reactory 
 * password reset form. The form is a schema generated
 * form, with a custom widget injected at runtime.
 */
import Reactory from '@reactory/reactory-core'

type PasswordResetFormDeps = {
  React: Reactory.React,
  ReactoryForm: React.FC<any>,
  ReactRouter: Reactory.Routing.ReactRouterDom,
  Material: Reactory.Client.Web.IMaterialModule
}

export const PasswordResetForm = (props: Reactory.IReactoryComponentProps) => {
  const { reactory } = props;

  const { React, ReactoryForm, ReactRouter, Material } = reactory.getComponents<PasswordResetFormDeps>(
    [
      "react.React",
      "react-router.ReactRouter",
      "core.ReactoryForm",
      "material-ui.Material",
    ]
  );
  const { useState, useEffect } = React as Reactory.React;

  const { MaterialStyles, MaterialCore } = Material;

  const {
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    Icon,
    Typography,
  } = MaterialCore;
 
  const [formData, setFormData] = useState({
    user: reactory.getUser(),
    password: "",
    passwordConfirm: "" || " ",
    authToken: localStorage.getItem("auth_token"),
  });

  const navigation = ReactRouter.useNavigate();

  const classes = MaterialStyles.makeStyles((theme) => {
    return {
      paper: {
        maxWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto",
      },
      form_root: {
        marginTop: "10px",
        padding: "24px",
      },
      header: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "5rem",
        marginTop: "20px",
      },
      logo: {
        paddingBottom: "1rem",
      },
    };
  })();


  /**
   * 
   * @param param0 The resert password field, is a custom form field within the reactory forms engine.
   * @returns 
   */
  const ReactoryPasswordField = ({ formData, onChange }) => {
    const [values, setValues] = React.useState({
      showPassword: false,
    });

    const handleChange = (prop) => (event) => {
      // setValues({ ...values, [prop]: event.target.value });
      onChange(event.target.value);
    };

    const handleClickShowPassword = () => {
      setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
    };

    return (
      <FormControl>
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          id="standard-adornment-password"
          type={values.showPassword ? "text" : "password"}
          value={formData}
          onChange={handleChange("password")}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                <Icon>
                  {values.showPassword ? "visibility" : "visibility_off"}
                </Icon>
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    );
  };

  /**
   * We register the component in the reactory eco system 
   */
  reactory.componentRegister["core.ReactoryPasswordField@1.0.0"] = {
    nameSpace: "core",
    name: "ReactoryPasswordField",
    component: ReactoryPasswordField,
    version: "1.0.0",
  };


  /**
   * The onSubmit handler
   * @param param0 
   * @returns 
   */
  const onSubmit = ({ formData, uiSchema, schema, errors, formContext }) => {
    reactory.log(
      `onSubmit`,
      { formData, uiSchema, schema, errors, formContext },
      "error"
    );

    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      reactory.createNotification(
        "The passwords do not match, please check your input",
        {
          type: "warning",
          canDismiss: true,
          timeOut: 3500,
          showInAppNotification: true,
        }
      );

      return;
    }

    reactory
      .resetPassword({
        password: password,
        confirmPassword: confirmPassword,
        resetToken: null,
      })
      .then((forgotResult) => {
        reactory.createNotification(
          "Your password has been updated, you will be redirected momentarily",
          {
            type: "success",
            canDismiss: true,
            timeOut: 3500,
            showInAppNotification: true,
          }
        );

        let last_route = localStorage.getItem(
          "$reactory.last.attempted.route$"
        ) || "/";
        if(last_route && last_route.includes('reset-password')) last_route = "/"
        setTimeout(() => {
          //history.push(last_route);
          navigation(last_route);
        }, 3501);
      })
      .catch((error) => {
        reactory.log(
          `Error updating the password ${error.message}`,
          { error },
          "error"
        );
      });
  };

  const getFormDefinition = () => {
    return {
      id: "ResetPasswordForm",
      uiFramework: "material",
      uiSupport: ["material", "bootstrap"],
      uiResources: [],
      title: "Password Reset",
      tags: ["forgot password reset", "user account", "reset passwords"],
      registerAsComponent: true,
      name: "ResetPasswordForm",
      nameSpace: "forms",
      version: "1.0.0",
      backButton: true,
      helpTopics: ["password-reset"],
      widgetMap: [
        {
          componentFqn: "core.ReactoryPasswordField@1.0.0",
          widget: "ReactoryPasswordField",
        },
      ],
      schema: {
        title: "",
        description:
          "Provide a new password and confirm it in order to change your password",
        type: "object",
        required: ["user", "authToken", "password", "confirmPassword"],
        properties: {
          user: {
            type: "object",
            title: "User",
            properties: {
              firstName: {
                type: "string",
                title: "First name",
              },
              lastName: {
                type: "string",
                title: "Last name",
              },
              email: {
                type: "string",
                title: "Email Address",
                readOnly: true,
              },
              avatar: {
                type: "string",
                title: "Avatar",
              },
            },
          },
          authToken: {
            type: "string",
            title: "Token",
            readOnly: true,
          },
          password: {
            type: "string",
            title: "Password",
            format: "password",
          },
          confirmPassword: {
            type: "string",
            title: "Confirm Password",
            format: "password",
          },
        },
      },
      uiSchema: {
        'ui-options': {
          showErrorList: false,
        },
        user: {
          "ui:widget": "UserListItemWidget",
        },
        authToken: {
          "ui:widget": "HiddenWidget",
        },
        password: {
          "ui:help": "Ensure your password is at least 8 characters long.",
          "ui:options": {
            showLabel: false,
          },
          "ui:widget": "ReactoryPasswordField",
        },
        confirmPassword: {
          "ui:options": {
            showLabel: false,
          },
          "ui:widget": "ReactoryPasswordField",
        },
      },
    };
  };

  const onValidate = (formData, errors, formContext, method) => {
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      errors.confirmPassword.addError(
        "Confirm password must match the password"
      );

      if (method === "submit") {
        reactory.createNotification(
          "The passwords do not match, please check your input",
          {
            type: "warning",
            canDismiss: true,
            timeOut: 3500,
            showInAppNotification: false,
          }
        );
      }
    }

    return errors;
  };

  return (
    <Paper elevation={1} className={classes.paper}>      
      <ReactoryForm
        className={classes.form_root}
        formDef={getFormDefinition()}
        validate={onValidate}
        liveValidate={true}
        onSubmit={onSubmit}
        formData={formData}
      />
    </Paper>
  );
};

const PasswordResetFormRegistration: Reactory.Client.IReactoryComponentRegistryEntry<typeof PasswordResetForm> =  {
  nameSpace: "core",
  name: "ResetPassword",
  component: PasswordResetForm,
  version: "1.0.0",
  roles: ["USER"],
  tags: [],
  componentType: "form",
  connectors: []
};

export default PasswordResetFormRegistration;
