import Reactory from '@reactorynet/reactory-core';

interface LoginDependencies {
  Logo: (props: any, context: any) => JSX.Element;
  Loading: (props: any, context: any) => JSX.Element;
  BasicModal: (props: any, context: any) => JSX.Element;
  Material: Reactory.Client.Web.IMaterialModule;
  ReactRouter: Reactory.Routing.ReactRouter;
  ReactRouterDom: Reactory.Routing.ReactRouterDom;
  React: Reactory.React;
}

type AuthProvider =
  | string
  | {
      provider: string;
      component: Reactory.FQN;
      props?: { [key: string]: any };
    };

interface IReactoryLoginProps extends Reactory.IReactoryComponentProps {
  authlist?: AuthProvider[];
  magicLink?: boolean;
  redirectAfterLogin?: boolean;
  allowRegistration?: boolean;
}

/**
 * Modern LoginCard component with animated transitions, show/hide password,
 * inline validation, and support for 2FA handoff.
 */
const LoginCard: React.FunctionComponent<IReactoryLoginProps> = (
  props: IReactoryLoginProps,
) => {
  const {
    reactory,
    authlist = ['local'],
    magicLink = false,
    redirectAfterLogin = true,
    allowRegistration = true,
  } = props;

  reactory.log(`LoginCard start`, { authlist, magicLink });

  const {
    React,
    BasicModal,
    Loading,
    Logo,
    Material,
    ReactRouter,
    ReactRouterDom,
  } = reactory.getComponents<LoginDependencies>([
    'core.Logo@1.0.0',
    'core.Loading@1.0.0',
    'core.BasicModal@1.0.0',
    'material-ui.Material@1.0.0',
    'react-router.ReactRouter@1.0.0',
    'react-router.ReactRouterDom@1.0.0',
    'react.React',
  ]);

  const {
    Alert,
    Avatar,
    Button,
    Box,
    Chip,
    CircularProgress,
    Collapse,
    Divider,
    Fade,
    IconButton,
    InputAdornment,
    LinearProgress,
    Link,
    Paper,
    // @ts-ignore
    Grid2,
    Icon,
    Stack,
    TextField,
    Tooltip,
    Typography,
  } = Material.MaterialCore;

  const Grid = Grid2;

  // -- State --
  const [username, setUsername] = React.useState<string>(
    localStorage ? localStorage.getItem('$reactory$last_logged_in_user') || '' : '',
  );
  const [password, setPassword] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [version, setVersion] = React.useState<number>(1);

  const passwordRef = React.useRef<HTMLDivElement>(null);

  const redirectOnLogin =
    !reactory.utils.lodash.isNil(reactory.queryObject) && reactory.queryObject.r
      ? reactory.queryObject.r
      : '/';

  const { useNavigate } = ReactRouterDom;
  const navigate = useNavigate();

  // Trigger mount animation
  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const clearError = () => {
    setLoginError(null);
    if (passwordRef.current?.focus) {
      passwordRef.current.focus();
    }
  };

  const doLogin = () => {
    setBusy(true);
    setLoginError(null);
    reactory.setLastUserEmail(username);

    reactory
      .login(username, password)
      .then((loginResult) => {
        reactory.log(
          `User login successful, loading user details`,
          { user: loginResult.user },
          'debug',
        );
        reactory
          .afterLogin(loginResult)
          .then((status: Reactory.Models.IApiStatus) => {
            reactory.log(
              `User login successful, redirecting to: ${redirectOnLogin}`,
              {},
              'debug',
            );
            if (redirectAfterLogin) {
              navigate(redirectOnLogin);
            }
          })
          .catch((statusErr) => {
            reactory.log(
              `Error getting status for user ${username}`,
              { statusErr },
              'error',
            );
            setBusy(false);
            setLoginError(
              reactory.i18n.t(
                'reactory:login.error.auth_failed',
                'Your account details could not be authenticated',
              ),
            );
            setTimeout(clearError, 5000);
          });
      })
      .catch((error) => {
        setBusy(false);

        // Check for 2FA requirement in the error response
        if (error?.requires2FA === true || error?.status === 'REQUIRES_2FA') {
          navigate('/2fa', {
            state: { email: username, sessionToken: error?.sessionToken },
          });
          return;
        }

        setLoginError(
          reactory.i18n.t(
            'reactory:login.error.auth_failed',
            'Your account details could not be authenticated',
          ),
        );
        setTimeout(clearError, 5000);
      });
  };

  const doEmailLogin = () => navigate('/send-link');
  const doRegister = () => navigate('/register');
  const doForgot = () => navigate('/forgot');

  const updateUsername = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(evt.target.value);
    if (localStorage) {
      localStorage.setItem('$reactory$last_logged_in_user', evt.target.value);
    }
  };

  const updatePassword = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(evt.target.value);

  const handleKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter' && enableLogin) {
      doLogin();
    }
  };

  const { isEmail, isValidPassword } = reactory.utils;
  const enableLogin = isEmail(username) && isValidPassword(password) && !busy;

  // -- Build auth provider components --
  const authComponents: JSX.Element[] = [];
  const socialProviders: JSX.Element[] = [];
  const activeTheme = reactory.getTheme();

  authlist.forEach((authType) => {
    if (typeof authType === 'string') {
      switch (authType) {
        case 'local': {
          authComponents.push(
            <Box sx={{ width: '100%' }} key={authType}>
              <Stack spacing={2.5}>
                <TextField
                  label={reactory.i18n.t('reactory:login.email_label', 'Email address')}
                  value={username}
                  onChange={updateUsername}
                  onKeyDown={handleKeyDown}
                  disabled={busy}
                  fullWidth
                  variant="outlined"
                  type="email"
                  autoComplete="email"
                  name="reactory-security::standard-login-email"
                  id="reactory-security::standard-login-email"
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon sx={{ color: 'text.secondary' }}>email</Icon>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  label={reactory.i18n.t('reactory:login.password_label', 'Password')}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  fullWidth
                  variant="outlined"
                  autoComplete="current-password"
                  onChange={updatePassword}
                  onKeyDown={handleKeyDown}
                  name="reactory-security::standard-login-password"
                  id="reactory-security::standard-login-password"
                  inputRef={passwordRef}
                  disabled={busy}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon sx={{ color: 'text.secondary' }}>lock</Icon>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          <Icon>
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </Icon>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Forgot Password Link */}
                <Box sx={{ textAlign: 'right', mt: -1 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={doForgot}
                    underline="hover"
                    id="reactory-security::standard-forgot-password-button"
                    sx={{ color: 'text.secondary', cursor: 'pointer' }}
                  >
                    {reactory.i18n.t(
                      'reactory:login.forgot_password',
                      'Forgot password?',
                    )}
                  </Link>
                </Box>

                {/* Error Alert */}
                <Collapse in={!!loginError}>
                  <Alert
                    severity="error"
                    onClose={clearError}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    {loginError}
                  </Alert>
                </Collapse>

                {/* Sign In Button */}
                <Button
                  id="reactory-security::standard-login-button"
                  onClick={doLogin}
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!enableLogin || busy}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: 2,
                    '&:hover': { boxShadow: 4 },
                  }}
                  startIcon={
                    busy ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Icon>login</Icon>
                    )
                  }
                >
                  {busy
                    ? reactory.i18n.t(
                        'reactory:login.signing_in',
                        'Signing in...',
                      )
                    : reactory.i18n.t('reactory:login.sign_in', 'Sign In')}
                </Button>

                {/* Magic Link */}
                {magicLink && (
                  <Button
                    onClick={doEmailLogin}
                    id="reactory-security::standard-send-link-button"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    disabled={busy}
                    startIcon={<Icon>link</Icon>}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                      textTransform: 'none',
                    }}
                  >
                    {reactory.i18n.t(
                      'reactory:login.send_magic_link',
                      'Sign in with Magic Link',
                    )}
                  </Button>
                )}
              </Stack>
            </Box>,
          );
          break;
        }
      }
    } else {
      const { provider, component } = authType;

      if (!component) {
        reactory.log(
          `Auth provider "${provider}" has no component FQN, skipping`,
          {},
          'warning',
        );
        return;
      }

      const AuthComponent = reactory.getComponent<React.FC>(component);
      let componentProps: Record<string, any> = {
        key: `login_${provider}`,
        reactory,
      };

      if (authType.props && typeof authType.props === 'object') {
        componentProps = { ...componentProps, ...authType.props };
      }

      if (!AuthComponent) {
        reactory.log(
          `Could not load the authentication component ${component} for provider ${provider}`,
          {},
          'warning',
        );
        reactory.on('componentRegistered', (fqn) => {
          if (fqn === component) {
            setVersion(version + 1);
          }
        });
      } else {
        socialProviders.push(<AuthComponent {...componentProps} />);
      }
    }
  });

  let logoResource = activeTheme.assets?.find((e) => e.name === 'logo');
  if (!logoResource || !logoResource.url) {
    logoResource = {
      name: 'logo',
      url: 'https://placehold.it/200x200',
    };
    reactory.log(
      `No logo resource found, using default`,
      {
        logoResource,
        activeTheme: activeTheme?.name,
        assetsCount: activeTheme.assets?.length,
      },
      'warning',
    );
  }

  return (
    <Grid
      container
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease infinite',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      {/* Left Brand Panel (hidden on mobile) */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
        }}
      >
        <Fade in={mounted} timeout={800}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 480,
              textAlign: 'center',
            }}
          >
            <Logo
              backgroundSrc={logoResource.url}
              aspectRatio="16/9"
              maxWidth="100%"
            />
            <Typography
              variant="h4"
              sx={{
                color: 'common.white',
                mt: 4,
                fontWeight: 300,
                letterSpacing: 0.5,
              }}
            >
              {reactory.i18n.t(
                'reactory:login.brand_tagline',
                'Welcome back',
              )}
            </Typography>
          </Box>
        </Fade>
      </Grid>

      {/* Right Login Panel */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 2, md: 4 },
        }}
      >
        <Fade in={mounted} timeout={600}>
          <Paper
            elevation={12}
            sx={{
              maxWidth: 460,
              width: '100%',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            {/* Progress indicator */}
            <Collapse in={busy}>
              <LinearProgress color="primary" />
            </Collapse>

            <Box sx={{ p: { xs: 3, sm: 4 } }}>
              {/* Mobile logo */}
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Logo
                  backgroundSrc={logoResource.url}
                  aspectRatio="16/9"
                  maxWidth="180px"
                />
              </Box>

              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    boxShadow: 3,
                  }}
                >
                  <Icon sx={{ fontSize: 28 }}>lock_outline</Icon>
                </Avatar>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {reactory.i18n.t('reactory:login.heading', 'Sign In')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reactory.i18n.t(
                    'reactory:login.subheading',
                    'Enter your credentials to continue',
                  )}
                </Typography>
              </Box>

              {/* Auth components (local form) */}
              {authComponents}

              {/* Social / external providers */}
              {socialProviders.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }}>
                    <Chip
                      label={reactory.i18n.t('reactory:login.or', 'OR')}
                      size="small"
                      variant="outlined"
                    />
                  </Divider>
                  <Stack
                    direction="column"
                    spacing={1.5}
                  >
                    {socialProviders}
                  </Stack>
                </>
              )}

              {/* Register link */}
              {allowRegistration && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {reactory.i18n.t(
                      'reactory:login.no_account',
                      "Don't have an account?",
                    )}{' '}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={doRegister}
                      underline="hover"
                      fontWeight={600}
                      sx={{ cursor: 'pointer' }}
                    >
                      {reactory.i18n.t(
                        'reactory:login.register_cta',
                        'Create one',
                      )}
                    </Link>
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Fade>
      </Grid>
    </Grid>
  );
};

type TLoginCard = typeof LoginCard;

const LoginCardRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TLoginCard> = {
  component: LoginCard,
  nameSpace: 'core',
  name: 'Login',
  version: '1.0.0',
  componentType: 'form',
  roles: ['ANON'],
  title: 'Reactory Login Card',
  tags: ['user', 'login'],
};

export default LoginCardRegistration;