import Reactory from '@reactorynet/reactory-core';

interface IRegisterDependencies {
  React: Reactory.React;
  Logo: React.FunctionComponent<any>;
  Material: Reactory.Client.Web.IMaterialModule;
  ReactRouterDom: Reactory.Routing.ReactRouterDom;
}

interface IRegisterProps extends Reactory.IReactoryComponentProps {
  allowOrganization?: boolean;
}

interface FieldErrors {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  username?: string | null;
  password?: string | null;
  passwordConfirm?: string | null;
  organizationName?: string | null;
}

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken';

/**
 * Computes a simple password strength score (0-4) for visual feedback.
 */
const getPasswordStrength = (password: string): number => {
  let score = 0;
  if (!password) return score;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
};

const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
const strengthColors = ['error', 'warning', 'info', 'success', 'success'] as const;

/**
 * Modern RegisterCard component with inline validation, password strength meter,
 * animated transitions, and functional component pattern.
 */
const RegisterCard: React.FunctionComponent<IRegisterProps> = (props) => {
  const { reactory, allowOrganization = true } = props;

  const {
    React,
    Logo,
    Material,
    ReactRouterDom,
  } = reactory.getComponents<IRegisterDependencies>([
    'react.React',
    'core.Logo@1.0.0',
    'material-ui.Material@1.0.0',
    'react-router.ReactRouterDom@1.0.0',
  ]);

  const {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
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
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
  } = Material.MaterialCore;

  const navigate = ReactRouterDom.useNavigate();

  // Parse query params for pre-filled organization data
  const queryParams = reactory.queryObject || {};

  // -- State --
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>('');
  const [organizationName, setOrganizationName] = React.useState<string>(
    (queryParams.onm as string) || '',
  );
  const [organizationId] = React.useState<string | null>(
    (queryParams.oid as string) || null,
  );
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [registerError, setRegisterError] = React.useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = React.useState<boolean>(false);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>('');
  const [usernameStatus, setUsernameStatus] = React.useState<UsernameStatus>('idle');
  const [usernameSuggestion, setUsernameSuggestion] = React.useState<string | null>(null);
  const usernameDebounce = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Lookup organization name if ID is provided
  React.useEffect(() => {
    if (organizationId && !organizationName) {
      reactory
        .companyWithId(organizationId)
        .then((result) => {
          if (result?.name) setOrganizationName(result.name);
        })
        .catch((err) => {
          reactory.log('Could not lookup company', { err }, 'warning');
        });
    }
  }, [organizationId]);

  const { nilStr, isEmail, isValidPassword } = reactory.utils;

  // Debounced username availability check
  React.useEffect(() => {
    if (usernameDebounce.current) clearTimeout(usernameDebounce.current);
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 3) {
      setUsernameStatus('idle');
      setUsernameSuggestion(null);
      return;
    }
    // Validate format before checking server
    if (!/^[a-z0-9_]{3,50}$/i.test(trimmed)) {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    setUsernameSuggestion(null);
    usernameDebounce.current = setTimeout(() => {
      (reactory as any).checkUsername(trimmed)
        .then((result: any) => {
          if (result?.exists) {
            setUsernameStatus('taken');
            setUsernameSuggestion(result.suggestion || null);
          } else {
            setUsernameStatus('available');
            setUsernameSuggestion(null);
          }
        })
        .catch(() => {
          setUsernameStatus('idle');
        });
    }, 500);
    return () => {
      if (usernameDebounce.current) clearTimeout(usernameDebounce.current);
    };
  }, [username]);

  // -- Field Validation --
  const validate = (): { valid: boolean; errors: FieldErrors } => {
    const errors: FieldErrors = {};
    let valid = true;

    if (nilStr(firstName)) {
      valid = false;
      errors.firstName = reactory.i18n.t(
        'reactory:register.error.firstName',
        'First name is required',
      );
    }
    if (nilStr(lastName)) {
      valid = false;
      errors.lastName = reactory.i18n.t(
        'reactory:register.error.lastName',
        'Last name is required',
      );
    }
    if (nilStr(email) || !isEmail(email)) {
      valid = false;
      errors.email = reactory.i18n.t(
        'reactory:register.error.email',
        'A valid email address is required',
      );
    }
    if (nilStr(password) || !isValidPassword(password)) {
      valid = false;
      errors.password = reactory.i18n.t(
        'reactory:register.error.password',
        'Password must be at least 8 characters',
      );
    }
    if (nilStr(passwordConfirm) || password !== passwordConfirm) {
      valid = false;
      errors.passwordConfirm = reactory.i18n.t(
        'reactory:register.error.passwordConfirm',
        'Passwords do not match',
      );
    }

    return { valid, errors };
  };

  const { valid, errors } = validate();

  // Step 1 fields validity (name + email + optionally org)
  const step1Valid =
    !nilStr(firstName) &&
    !nilStr(lastName) &&
    isEmail(email);

  // Step 2 fields validity (password + confirm)
  const step2Valid =
    isValidPassword(password) && password === passwordConfirm;

  const markTouched = (field: string) => {
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const doRegister = () => {
    if (!valid || busy) return;
    setBusy(true);
    setRegisterError(null);

    const payload = {
      user: { email, password, firstName, lastName, username: username.trim() || undefined },
      organization: { id: organizationId, name: organizationName },
    };

    (reactory as any)
      .register(payload)
      .then(() => {
        // Auto-login after successful registration
        reactory
          .login(email, password)
          .then((loginResult) => {
            reactory.afterLogin(loginResult).then(() => {
              navigate('/');
            });
          })
          .catch(() => {
            // Registration succeeded but auto-login failed;
            // show success and redirect to login
            setRegisterSuccess(true);
            setBusy(false);
          });
      })
      .catch((err) => {
        setBusy(false);
        setRegisterError(
          reactory.i18n.t(
            'reactory:register.error.failed',
            'Registration failed. Please try again or contact support.',
          ),
        );
      });
  };

  const handleKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      if (activeStep === 0 && step1Valid) {
        setActiveStep(1);
      } else if (activeStep === 1 && step2Valid) {
        doRegister();
      }
    }
  };

  const passwordStrength = getPasswordStrength(password);

  let logoResource = reactory.getTheme().assets?.find((e) => e.name === 'logo');
  if (!logoResource || !logoResource.url) {
    logoResource = { name: 'logo', url: 'https://placehold.it/200x200', assetType: 'image' } as any;
  }

  const steps = [
    reactory.i18n.t('reactory:register.step_account', 'Account Details'),
    reactory.i18n.t('reactory:register.step_security', 'Set Password'),
  ];

  // -- Success State --
  if (registerSuccess) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          backgroundSize: '200% 200%',
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
              <Icon sx={{ fontSize: 32 }}>check_circle</Icon>
            </Avatar>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {reactory.i18n.t('reactory:register.success_title', 'Account Created!')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {reactory.i18n.t(
                'reactory:register.success_body',
                'Your account has been created successfully. You can now sign in.',
              )}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 600,
              }}
              startIcon={<Icon>login</Icon>}
            >
              {reactory.i18n.t('reactory:register.go_to_login', 'Go to Sign In')}
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
            maxWidth: 500,
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
                maxWidth="320px"
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
                <Icon sx={{ fontSize: 28 }}>person_add</Icon>
              </Avatar>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {reactory.i18n.t('reactory:register.heading', 'Create Account')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {reactory.i18n.t(
                  'reactory:register.subheading',
                  'Fill in your details to get started',
                )}
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Error Alert */}
            <Collapse in={!!registerError}>
              <Alert
                severity="error"
                onClose={() => setRegisterError(null)}
                variant="outlined"
                sx={{ mb: 2, borderRadius: 2 }}
              >
                {registerError}
              </Alert>
            </Collapse>

            {/* Step 1: Account Details */}
            {activeStep === 0 && (
              <Fade in timeout={400}>
                <Stack spacing={2}>
                  {allowOrganization && (
                    <TextField
                      label={reactory.i18n.t(
                        'reactory:register.organization_label',
                        'Organisation',
                      )}
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      disabled={busy}
                      fullWidth
                      variant="outlined"
                      placeholder="Your company name"
                      onKeyDown={handleKeyDown}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon sx={{ color: 'text.secondary' }}>business</Icon>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}

                  <Stack direction="row" spacing={2}>
                    <TextField
                      label={reactory.i18n.t(
                        'reactory:register.firstName_label',
                        'First Name',
                      )}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => markTouched('firstName')}
                      onKeyDown={handleKeyDown}
                      disabled={busy}
                      fullWidth
                      variant="outlined"
                      error={touched.firstName && !!errors.firstName}
                      helperText={touched.firstName ? errors.firstName : undefined}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon sx={{ color: 'text.secondary' }}>person</Icon>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                      label={reactory.i18n.t(
                        'reactory:register.lastName_label',
                        'Last Name',
                      )}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={() => markTouched('lastName')}
                      onKeyDown={handleKeyDown}
                      disabled={busy}
                      fullWidth
                      variant="outlined"
                      error={touched.lastName && !!errors.lastName}
                      helperText={touched.lastName ? errors.lastName : undefined}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Stack>

                  <TextField
                    label={reactory.i18n.t(
                      'reactory:register.email_label',
                      'Email Address',
                    )}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => markTouched('email')}
                    onKeyDown={handleKeyDown}
                    disabled={busy}
                    fullWidth
                    variant="outlined"
                    type="email"
                    autoComplete="email"
                    error={touched.email && !!errors.email}
                    helperText={touched.email ? errors.email : undefined}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon sx={{ color: 'text.secondary' }}>email</Icon>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />

                  {/* Username field */}
                  <TextField
                    label={reactory.i18n.t(
                      'reactory:register.username_label',
                      'Preferred Username (optional)',
                    )}
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    onBlur={() => markTouched('username')}
                    onKeyDown={handleKeyDown}
                    disabled={busy}
                    fullWidth
                    variant="outlined"
                    autoComplete="username"
                    inputProps={{ maxLength: 50 }}
                    error={usernameStatus === 'taken'}
                    helperText={
                      usernameStatus === 'checking'
                        ? reactory.i18n.t('reactory:register.username_checking', 'Checking availability\u2026')
                        : usernameStatus === 'available'
                        ? reactory.i18n.t('reactory:register.username_available', 'Username is available')
                        : usernameStatus === 'taken'
                        ? reactory.i18n.t('reactory:register.username_taken', 'Username is already taken')
                        : reactory.i18n.t(
                            'reactory:register.username_hint',
                            'Leave blank to use your email address. Letters, numbers and underscores only.',
                          )
                    }
                    FormHelperTextProps={{
                      sx: {
                        color:
                          usernameStatus === 'available'
                            ? 'success.main'
                            : usernameStatus === 'taken'
                            ? 'error.main'
                            : 'text.secondary',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon sx={{ color: 'text.secondary' }}>alternate_email</Icon>
                        </InputAdornment>
                      ),
                      endAdornment: usernameStatus === 'checking' ? (
                        <InputAdornment position="end">
                          <CircularProgress size={18} />
                        </InputAdornment>
                      ) : usernameStatus === 'available' ? (
                        <InputAdornment position="end">
                          <Icon sx={{ color: 'success.main' }}>check_circle</Icon>
                        </InputAdornment>
                      ) : null,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />

                  {/* Suggestion chip when username is taken */}
                  {usernameStatus === 'taken' && usernameSuggestion && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="caption" color="text.secondary">
                        {reactory.i18n.t('reactory:register.username_suggestion', 'Try:')}
                      </Typography>
                      <Chip
                        label={usernameSuggestion}
                        size="small"
                        color="primary"
                        variant="outlined"
                        icon={<Icon style={{ fontSize: 14 }}>auto_fix_high</Icon>}
                        onClick={() => {
                          setUsername(usernameSuggestion);
                          setUsernameSuggestion(null);
                        }}
                        sx={{ cursor: 'pointer', fontFamily: 'monospace' }}
                      />
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => setActiveStep(1)}
                    disabled={!step1Valid}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                    endIcon={<Icon>arrow_forward</Icon>}
                  >
                    {reactory.i18n.t('reactory:register.next', 'Continue')}
                  </Button>
                </Stack>
              </Fade>
            )}

            {/* Step 2: Password */}
            {activeStep === 1 && (
              <Fade in timeout={400}>
                <Stack spacing={2}>
                  <TextField
                    label={reactory.i18n.t(
                      'reactory:register.password_label',
                      'Password',
                    )}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => markTouched('password')}
                    onKeyDown={handleKeyDown}
                    disabled={busy}
                    fullWidth
                    variant="outlined"
                    autoComplete="new-password"
                    error={touched.password && !!errors.password}
                    helperText={touched.password ? errors.password : undefined}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon sx={{ color: 'text.secondary' }}>lock</Icon>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />

                  {/* Password strength meter */}
                  {password.length > 0 && (
                    <Box>
                      <LinearProgress
                        variant="determinate"
                        value={(passwordStrength / 4) * 100}
                        color={strengthColors[passwordStrength]}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          mb: 0.5,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {reactory.i18n.t(
                          'reactory:register.password_strength',
                          'Password strength:',
                        )}{' '}
                        <Box
                          component="span"
                          sx={{
                            fontWeight: 600,
                            color: `${strengthColors[passwordStrength]}.main`,
                          }}
                        >
                          {strengthLabels[passwordStrength]}
                        </Box>
                      </Typography>
                    </Box>
                  )}

                  <TextField
                    label={reactory.i18n.t(
                      'reactory:register.passwordConfirm_label',
                      'Confirm Password',
                    )}
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    onBlur={() => markTouched('passwordConfirm')}
                    onKeyDown={handleKeyDown}
                    disabled={busy}
                    fullWidth
                    variant="outlined"
                    autoComplete="new-password"
                    error={touched.passwordConfirm && !!errors.passwordConfirm}
                    helperText={
                      touched.passwordConfirm ? errors.passwordConfirm : undefined
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon sx={{ color: 'text.secondary' }}>lock_outline</Icon>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            size="small"
                          >
                            <Icon>
                              {showConfirmPassword
                                ? 'visibility_off'
                                : 'visibility'}
                            </Icon>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(0)}
                      disabled={busy}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        flex: 1,
                      }}
                      startIcon={<Icon>arrow_back</Icon>}
                    >
                      {reactory.i18n.t('reactory:register.back', 'Back')}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={doRegister}
                      disabled={!valid || busy}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        flex: 2,
                        boxShadow: 2,
                        '&:hover': { boxShadow: 4 },
                      }}
                      startIcon={
                        busy ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Icon>person_add</Icon>
                        )
                      }
                    >
                      {busy
                        ? reactory.i18n.t(
                            'reactory:register.creating',
                            'Creating...',
                          )
                        : reactory.i18n.t(
                            'reactory:register.submit',
                            'Create Account',
                          )}
                    </Button>
                  </Stack>
                </Stack>
              </Fade>
            )}

            {/* Login link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {reactory.i18n.t(
                  'reactory:register.have_account',
                  'Already have an account?',
                )}{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  underline="hover"
                  fontWeight={600}
                  sx={{ cursor: 'pointer' }}
                >
                  {reactory.i18n.t('reactory:register.login_cta', 'Sign In')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

type TRegister = typeof RegisterCard;

const RegisterCardRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TRegister> = {
  nameSpace: 'core',
  name: 'Register',
  version: '1.0.0',
  component: RegisterCard,
  componentType: 'form',
  connectors: [],
  roles: ['ANON', 'USER'],
  tags: ['register', 'user'],
};

export default RegisterCardRegistration;