import Reactory from '@reactorynet/reactory-core';

const getInitialEmail = () => {
  let lastEmail = '';
  if (localStorage && localStorage.getItem) {
    lastEmail = localStorage.getItem('$reactory$last_logged_in_user') || '';
  }
  return lastEmail;
};

interface IForgotComponentProps extends Reactory.IReactoryComponentProps {
  magicLink: boolean;
}

interface IForgotDependencies {
  React: Reactory.React;
  AlertDialog: any;
  Logo: React.FunctionComponent<any>;
  Material: Reactory.Client.Web.IMaterialModule;
  ReactoryForm: React.FunctionComponent;
  ErrorBoundary: React.ComponentClass<any, any>;
  ReactRouterDom: Reactory.Routing.ReactRouterDom;
}

/**
 * Modern ForgotPassword component with multi-step flow,
 * animated transitions, and clear user feedback.
 */
const Forgot = (props: IForgotComponentProps) => {
  const { reactory, magicLink } = props;
  const {
    React,
    Logo,
    AlertDialog,
    Material,
    ReactoryForm,
    ErrorBoundary,
    ReactRouterDom,
  } = reactory.getComponents([
    'react.React',
    'core.Loading',
    'core.Layout',
    'core.Logo@1.0.0',
    'material-ui.Material',
    'core.AlertDialog',
    'core.ReactoryForm',
    'core.ErrorBoundary',
    'react-router.ReactRouterDom',
  ]) as IForgotDependencies;

  const navigate = ReactRouterDom.useNavigate();

  const {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Collapse,
    Fade,
    Icon,
    IconButton,
    InputAdornment,
    LinearProgress,
    Link,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
  } = Material.MaterialCore;

  const [email, setEmail] = React.useState<string>(getInitialEmail());
  const [emailSent, setEmailSent] = React.useState<boolean>(false);
  const [hasError, setHasError] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);

  const { isEmail } = reactory.utils;
  const isValidEmail = isEmail(email);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = () => {
    if (!isValidEmail || busy) return;
    setBusy(true);
    setHasError(false);
    setMessage(null);

    reactory
      .forgot({ email })
      .then(() => {
        setBusy(false);
        setEmailSent(true);
      })
      .catch(() => {
        setBusy(false);
        setHasError(true);
        setMessage(
          reactory.i18n.t(
            'reactory:forgot.error.send_failed',
            'Could not send the email. If this problem persists please contact our helpdesk.',
          ),
        );
      });
  };

  const goBack = () => navigate(-1);
  const goToLogin = () => navigate('/login');

  const emailKeyPressHandler = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      onSubmit();
    }
  };

  const updateEmailAddress = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  let logoResource = reactory.getTheme().assets?.find((e) => e.name === 'logo');
  if (!logoResource || !logoResource.url) {
    logoResource = { name: 'logo', url: 'https://placehold.it/200x200' };
  }

  // -- Success State --
  if (emailSent) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          p: 2,
        }}
      >
        <Fade in timeout={600}>
          <Paper
            elevation={12}
            sx={{
              maxWidth: 460,
              width: '100%',
              borderRadius: 4,
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                bgcolor: 'success.main',
                boxShadow: 3,
              }}
            >
              <Icon sx={{ fontSize: 32 }}>mark_email_read</Icon>
            </Avatar>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {reactory.i18n.t('reactory:forgot.email_sent_title', 'Check your inbox')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {magicLink === false
                ? reactory.i18n.t(
                    'reactory:forgot.email_sent_body',
                    'We\'ve sent password reset instructions to your email. Please allow a few minutes for delivery.',
                  )
                : reactory.i18n.t(
                    'reactory:forgot.magic_link_sent_body',
                    'We\'ve sent a magic link to your email. Click the link to sign in. Please allow a few minutes for delivery.',
                  )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {email}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={goToLogin}
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 600,
              }}
              startIcon={<Icon>arrow_back</Icon>}
            >
              {reactory.i18n.t('reactory:forgot.back_to_login', 'Back to Sign In')}
            </Button>
          </Paper>
        </Fade>
      </Box>
    );
  }

  // -- Main Form --
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
        p: 2,
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
            {/* Logo */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Logo
                backgroundSrc={logoResource.url}
                aspectRatio="16/9"
                maxWidth="140px"
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
                  bgcolor: 'warning.main',
                  boxShadow: 3,
                }}
              >
                <Icon sx={{ fontSize: 28 }}>help_outline</Icon>
              </Avatar>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {magicLink === false
                  ? reactory.i18n.t('reactory:forgot.heading', 'Reset Password')
                  : reactory.i18n.t('reactory:forgot.magic_heading', 'Get a Magic Link')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {magicLink === false
                  ? reactory.i18n.t(
                      'reactory:forgot.subheading',
                      'Enter your email address and we\'ll send you instructions to reset your password.',
                    )
                  : reactory.i18n.t(
                      'reactory:forgot.magic_subheading',
                      'Enter your email address and we\'ll send you a magic link to sign in.',
                    )}
              </Typography>
            </Box>

            {/* Error Alert */}
            <Collapse in={hasError}>
              <Alert
                severity="error"
                onClose={() => setHasError(false)}
                variant="outlined"
                sx={{ mb: 2, borderRadius: 2 }}
              >
                {message}
              </Alert>
            </Collapse>

            {/* Email Field */}
            <Stack spacing={2.5}>
              <TextField
                label={reactory.i18n.t('reactory:forgot.email_label', 'Email address')}
                value={email}
                onChange={updateEmailAddress}
                onKeyPress={emailKeyPressHandler}
                fullWidth
                variant="outlined"
                type="email"
                autoComplete="email"
                autoFocus
                disabled={busy}
                error={email.length > 0 && !isValidEmail}
                helperText={
                  email.length > 0 && !isValidEmail
                    ? reactory.i18n.t(
                        'reactory:forgot.invalid_email',
                        'Please enter a valid email address',
                      )
                    : undefined
                }
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

              {/* Submit Button */}
              <Button
                onClick={onSubmit}
                variant="contained"
                color="primary"
                size="large"
                disabled={!isValidEmail || busy}
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
                    <Icon>send</Icon>
                  )
                }
              >
                {busy
                  ? reactory.i18n.t('reactory:forgot.sending', 'Sending...')
                  : magicLink === false
                    ? reactory.i18n.t('reactory:forgot.send_reset', 'Send Reset Link')
                    : reactory.i18n.t('reactory:forgot.send_magic', 'Send Magic Link')}
              </Button>

              {/* Back to login */}
              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={goBack}
                  underline="hover"
                  sx={{
                    color: 'text.secondary',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Icon sx={{ fontSize: 18 }}>arrow_back</Icon>
                  {reactory.i18n.t('reactory:forgot.back', 'Back to Sign In')}
                </Link>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

type TForgot = typeof Forgot;

const ForgotComponentRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TForgot> = {
  nameSpace: 'core',
  name: 'ForgotPassword',
  component: Forgot,
  version: '1.0.0',
  roles: ['USER', 'ANON'],
  tags: [],
  componentType: 'form',
  connectors: [],
};

export default ForgotComponentRegistration;