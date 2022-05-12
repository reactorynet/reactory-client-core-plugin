import Reactory from '@reactory/reactory-core';

const getInitialEmail = () => {
  let lastEmail = '';
  if (localStorage && localStorage.getItem) {
    lastEmail = localStorage.getItem('$reactory$last_logged_in_user');
  }

  return lastEmail;
}

interface IForgotComponentProps extends Reactory.IReactoryComponentProps {
  magicLink: boolean
}

interface IForgotDependencies {
  React: Reactory.React,
  AlertDialog: any,
  Logo: React.FunctionComponent<any>
  Material: {
    MaterialCore: any
  },
  ReactoryForm: React.FunctionComponent,
  ErrorBoundary: React.ComponentClass<any, any>,
  ReactRouterDom: Reactory.Routing.ReactRouterDom;
}



/**
 * 
 * @param props 
 * @returns 
 */
const Forgot = (props: IForgotComponentProps) => {
  const { reactory, history, magicLink } = props;
  const { React, Logo, AlertDialog, Material, ReactoryForm, ErrorBoundary, ReactRouterDom } = reactory.getComponents(["react.React",
    "core.Loading",
    "core.Layout",
    'core.Logo@1.0.0',
    "material-ui.Material",
    "core.AlertDialog",
    "core.ReactoryForm",
    "core.ErrorBoundary",
    "react-router.ReactRouterDom",
  ]) as IForgotDependencies;

  const navigate = ReactRouterDom.useNavigate();

  try {
    const [email, setEmail] = React.useState<string>(getInitialEmail());
    const [emailSent, setEmailSent] = React.useState<boolean>(false);
    const [hasError, setHasError] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>(null);

    const onSubmit = () => {
      reactory.forgot({ email: email }).then((forgotResult) => {
        setEmailSent(true)
      }).catch((error) => {
        setHasError(true);
        setMessage("Could not send an email. If this problem persists please contact our helpdesk.");
      });
    }

    const goBack = () => {
      navigate(-1);
    }

    const emailKeyPressHandler = (keyPressEvent: React.KeyboardEvent<HTMLInputElement>) => {
      if (keyPressEvent.key === "Enter") {
        onSubmit();
      }
    }

    const {
      Button,
      Fab,
      Grid,
      Icon,
      Paper,
      TextField,
      Tooltip,
      Typography,
    } = Material.MaterialCore;

    if (emailSent === true) {
      return (
        <AlertDialog open={true} onClose={goBack} title="Email Sent">
          <Typography variant="heading">
            {magicLink === false
              ? 'An email has been sent with instructions to reset your password. Please allow a few minutes for delivery'
              : 'An email has been sent with a magic link to login. Please allow a few minutes for delivery'}
          </Typography>
        </AlertDialog>)
    }
    if (hasError === true) {
      return (<div><Typography variant="heading">{message}</Typography></div>);
    }

    const beforeComponent = (<div style={{ marginBottom: '16px', marginTop: '20%' }}></div>)
    const updateEmailAddress = (e: React.KeyboardEvent<HTMLInputElement>) => setEmail(e.currentTarget.value);

    let logoResource = reactory.getTheme().assets.find((e) => e.name === "logo");

    return (<Grid container alignItems="center" spacing={{ xs: 2, md: 3, lg: 4 }} columns={{ xs: 2, md: 2, lg: 4 }}>
      <Grid item xs={12} lg={12} alignContent="center">
        <Logo backgroundSrc={logoResource?.url} />
      </Grid>
      <Grid item xs={12} lg={12} alignContent="center">
        <Paper style={{ maxWidth: 600, margin: 'auto', textAlign: 'center' }} >
          <ErrorBoundary FallbackComponent={(props) => (<>Error occured in Forgot Password: {props.error}</>)}>
            <div style={{ maxWidth: 600, margin: 'auto' }}>            
              <Paper style={{ padding: '16px' }}>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      onChange={updateEmailAddress}
                      onKeyPress={emailKeyPressHandler}
                      value={email}
                      label="Email"
                      fullWidth={true}
                      helperText={magicLink === false ?
                        "Enter your email and click the send button below to start the reset process for your account." :
                        "Enter your email address and we will send you link to log in with."
                      }
                      style={{ marginBottom: '50px' }}
                      inputProps={{
                        inputProps: {
                          onKeyPress: emailKeyPressHandler
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="button" onClick={goBack} variant="flat"><Icon>keyboard_arrow_left</Icon>&nbsp;BACK</Button>
                    <Tooltip title={magicLink === false ? "Click to send a reset email" : "Click to send a magic link to login with"}>
                      <Fab onClick={onSubmit} variant="rounded" color="primary" ><Icon>send</Icon></Fab>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          </ErrorBoundary>
        </Paper>
      </Grid>
    </Grid>)
  } catch (err) {
    return <>{err.message}</>
  }
}


type TForgot = typeof Forgot;

const ForgotComponentRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TForgot> = {
  nameSpace: "core",
  name: "ForgotPassword",
  component: Forgot,
  version: "1.0.0",
  roles: ["USER", "ANON"],
  tags: [],
  componentType: "form",
  connectors: []
}

export default ForgotComponentRegistration;