import Reactory from '@reactory/reactory-core';

interface LoginDependencies {
  Logo: (props: any, context: any) => JSX.Element;
  Loading: (props: any, context: any) => JSX.Element;
  BasicModal: (props: any, context: any) => JSX.Element;
  MicrosoftLogin: (props: any, context: any) => JSX.Element;
  Material: Reactory.Client.Web.IMaterialModule;
  ReactRouter: Reactory.Routing.ReactRouter,
  ReactRouterDom: Reactory.Routing.ReactRouterDom,
  React: Reactory.React
};


type AuthProvider = string | {
  provider: string,
  component: Reactory.FQN,
  props?: {
    [key: string]: any
  }
}

interface IReactoryLoginProps extends Reactory.IReactoryComponentProps {
  authlist?: AuthProvider[],
  magicLink?: boolean,
  redirectAfterLogin?: boolean,
}

const LoginCard: React.FunctionComponent<IReactoryLoginProps> = (props: IReactoryLoginProps) => {

  const { 
    reactory, 
    authlist = ['local'], 
    magicLink = false, 
    redirectAfterLogin = true,
  } = props;
  // this.state = {
  //   username: localStorage ? localStorage.getItem('$reactory$last_logged_in_user') : '',
  //   password: '',
  //   loginError: null,
  //   busy: false,
  //   loggedIn: false,
  //   redirectOnLogin: reactory.utils.lodash.isNil(reactory.queryObject) === false && reactory.queryObject.r ? reactory.queryObject.r : '/'
  // };
  reactory.log(`LoginCard start`, { authlist, magicLink });
  const {
    React,
    BasicModal,
    Loading,
    Logo,
    Material,
    MicrosoftLogin,
    ReactRouter,
    ReactRouterDom,
  } = reactory.getComponents<LoginDependencies>([
    'core.Logo@1.0.0',
    'core.Loading@1.0.0',
    'core.BasicModal@1.0.0',
    'microsoft.MicrosoftLogin@1.0.0',
    'material-ui.Material@1.0.0',
    'react-router.ReactRouter@1.0.0',
    'react-router.ReactRouterDom@1.0.0',
    'react.React'
  ]);

  const {
    Button,
    Box,
    Fab,
    Paper,
    // @ts-ignore
    Grid2,
    Icon,
    Stack,
    TextField,
    Typography,
  } = Material.MaterialCore;
  const Grid = Grid2;
  const [username, setUsername] = React.useState<string>(localStorage ? localStorage.getItem('$reactory$last_logged_in_user') : '');
  const [password, setPassword] = React.useState<string>();
  const [loginError, setLoginError] = React.useState<string>();
  const [busy, setBusy] = React.useState<boolean>(false);
  const [version, setVersion] = React.useState<number>(1);

  const PasswordRef = React.useRef<HTMLDivElement>(null)
  
  const redirectOnLogin = reactory.utils.lodash.isNil(reactory.queryObject) === false && reactory.queryObject.r ? reactory.queryObject.r : '/';

  const { useNavigate } = ReactRouterDom

  const navigate = useNavigate();

  const clearError = () => { 
    setLoginError(null); 
    if(PasswordRef.current && PasswordRef.current.focus) {
      PasswordRef.current.focus();
    }
  }

  const doLogin = () => {
    setBusy(true)    
    reactory.setLastUserEmail(username);
    reactory.login(username, password).then((loginResult) => { 
      reactory.log(`User login successful, loading user details`, { user: loginResult.user }, 'debug'); 
      reactory.afterLogin(loginResult).then((status: Reactory.Models.IApiStatus) => {       
        reactory.log(`User login successful, redirecting to: ${redirectOnLogin}`, {}, 'debug');         
        if ( redirectAfterLogin ) { 
          navigate(redirectOnLogin)        
        }
      }).catch((statusErr) => {
        reactory.log(`Error getting status for user ${username}`, {statusErr}, 'error');
        setBusy(false);
        setLoginError('Your account details could not be authenticated');
        setTimeout(clearError, 4500);
      });
    }).catch((error) => {      
      setBusy(false);
      setLoginError('Your account details could not be authenticated');
      setTimeout(clearError, 4500);
    });
  }

  const doEmailLogin = () => {    
    navigate('/send-link');
  }

  const doRegister = evt => navigate('/register')
  const doForgot = evt => navigate('/forgot')
  const updateUsername = (evt) => {
    //this.setState({ username: evt.target.value })
    setUsername(evt.target.value)
    if (localStorage) {
      localStorage.setItem('$reactory$last_logged_in_user', evt.target.value);
    }
  }
  const updatePassword = (evt) => setPassword(evt.target.value)
  const keyPressPassword = (evt) => {
    if (evt.charCode === 13) {
      doLogin()
    }
  }
      
  const { isEmail, isValidPassword } = reactory.utils;
  const enableLogin = isEmail(username) && isValidPassword(password) && !busy;

  const authcomponents = [];
  const activeTheme = reactory.getTheme();

  authlist.forEach(authType => {

    if(typeof authType === 'string' ) {
      switch (authType) {
        case 'local': {
          authcomponents.push((
            <Box sx={{ maxWidth: '600px', padding: reactory.muiTheme.spacing(2)  }} key={authType}>
              <Stack spacing={3} justifyContent="center" alignItems={"center"}>
                <TextField
                  label="Email"
                  value={username}
                  onChange={updateUsername}
                  disabled={busy}
                  style={{ width: '100%' }}
                  name='reactory-security::standard-login-email'
                  id='reactory-security::standard-login-email'
                  autoFocus={true}
                />
  
                <TextField
                  label='Password'
                  type='password'
                  value={password}
                  style={{ width: '100%' }}
                  onChange={updatePassword}
                  onKeyPress={keyPressPassword}
                  name='reactory-security::standard-login-password'
                  id='reactory-security::standard-login-password'
                  ref={(field: HTMLDivElement) => { PasswordRef.current = field }}
                  disabled={busy}
                />
  
                <Fab
                  id="reactory-security::standard-login-button"
                  name="reactory-security::standard-login-button"
                  onClick={doLogin}
                  color="primary"
                  disabled={enableLogin === false || busy === true}
                  style={{ marginTop: '20px' }}>
                  <Icon>lock_open</Icon>
                </Fab>
  
                <Button onClick={doForgot} color='secondary' id="reactory-security::standard-forgot-password-button" name="reactory-security::standard-forgot-password-button" disabled={busy} style={{ marginTop: '20px' }}>
                  Forgot Password
                </Button>
  
                {magicLink === true &&
                  <Button onClick={doEmailLogin} id="reactory-security::standard-send-link-button" name="reactory-security::standard-send-link-button" color='secondary' disabled={busy} style={{ marginTop: '20px' }}>
                    Send Magic Link
                  </Button>}
              </Stack>
            </Box>))
          break;
        }
        case 'microsoft': {
          authcomponents.push(MicrosoftLogin ? <MicrosoftLogin key={authType} /> : <p key={authType}>Login Button goes here</p>);
          break;
        }
      }
    } else {

      const { provider, component } = authType;
      const AuthComponent = reactory.getComponent<React.FC>(component);
      let componentProps = {
        key: `login_${provider}`,
      };
      
      if(authType.props && typeof authType.props === 'object') {
        componentProps = { ...componentProps, ...authType.props };
      }

      if(!AuthComponent) {
        reactory.log(`Could not load the authentication component ${component} for provider ${provider}`,{},'warning');
        reactory.on('componentRegistered', (fqn) => {
          if(fqn === component) { 
            setVersion(version + 1);
          }
          reactory.log(`Component ${component} has been registered, reloading login card`);
          
        });
      } else {
        authcomponents.push((<AuthComponent {...componentProps} />))
      }
    }
  });

  let logoResource = activeTheme.assets?.find((e) => e.name === "logo");
  if(!logoResource || !logoResource.url) {
    logoResource = {
      name: 'logo',
      url: 'https://placehold.it/200x200'
    };

    reactory.log(`No logo resource found, using default`, { 
      logoResource, 
      activeTheme: activeTheme?.name, 
      assetsCount: activeTheme.assets?.length 
    }, 'warning');
  }
  return (
    <Grid 
      container
      spacing={{ xs: 2, md: 4 }}
      sx={{ 
        minHeight: '100vh', 
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, md: 4 }
      }}>
      {/* Logo Section */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: { xs: 2, md: 4 }
      }}>
        <Box sx={{ 
          width: '100%',
          maxWidth: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
          textAlign: 'center'
        }}>
          <Logo 
            backgroundSrc={logoResource.url}
            aspectRatio="16/9"
            maxWidth="100%"
          />
        </Box>
      </Grid>
      
      {/* Login Components Section */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper 
          sx={{ 
            maxWidth: 600, 
            width: '100%',
            textAlign: 'center',
            padding: { xs: 2, md: 3 }
          }}>
          <Typography 
            variant="h6" 
            color="primary" 
            sx={{ 
              fontSize: { xs: '60px', md: '80px' }, 
              marginTop: { xs: 2, md: 3 }, 
              marginBottom: { xs: 2, md: 3 }
            }}>
            <Icon fontSize='inherit'>security</Icon>
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="secondary"
            sx={{ marginBottom: 2 }}>
            {loginError || 'Welcome, please sign in below'}
          </Typography>
          {authcomponents}
        </Paper>
      </Grid>
    </Grid>
  )
};

type TLoginCard = typeof LoginCard;

const LoginCardRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TLoginCard> = {
  component: LoginCard,
  nameSpace: 'core',
  name: 'Login',
  version: '1.0.0',
  componentType: "form",
  roles: ["ANON"],
  title: "Reactory Login Card",
  tags: ["user", "login"]
}

export default LoginCardRegistration;