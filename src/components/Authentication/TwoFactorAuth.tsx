import Reactory from '@reactorynet/reactory-core';

interface ITwoFactorDependencies {
  React: Reactory.React;
  Logo: React.FunctionComponent<any>;
  Material: Reactory.Client.Web.IMaterialModule;
  ReactRouterDom: Reactory.Routing.ReactRouterDom;
}

interface ITwoFactorProps extends Reactory.IReactoryComponentProps {
  /** Number of digits in the OTP code (default: 6) */
  codeLength?: number;
  /** Countdown timer in seconds before resend is available (default: 60) */
  resendTimeout?: number;
  /** Route to redirect after successful verification */
  redirectTo?: string;
}

/**
 * Two-Factor Authentication (2FA) verification component.
 *
 * Presents a modern OTP code entry screen with individual digit inputs,
 * countdown timer for resend, and auto-submit on code completion.
 *
 * NOTE: The server-side 2FA endpoints (verify, resend) are planned for
 * a secondary phase. This component is wired to call `reactory.rest`
 * endpoints `/2fa/verify` and `/2fa/resend` when they become available.
 * In the interim, the component structure and UX are fully functional
 * and ready for backend integration.
 */
const TwoFactorAuth: React.FunctionComponent<ITwoFactorProps> = (props) => {
  const {
    reactory,
    codeLength = 6,
    resendTimeout = 60,
    redirectTo = '/',
  } = props;

  const {
    React,
    Logo,
    Material,
    ReactRouterDom,
  } = reactory.getComponents<ITwoFactorDependencies>([
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
    CircularProgress,
    Collapse,
    Fade,
    Icon,
    LinearProgress,
    Link,
    Paper,
    Stack,
    TextField,
    Typography,
  } = Material.MaterialCore;

  const navigate = ReactRouterDom.useNavigate();
  const location = ReactRouterDom.useLocation();

  // Retrieve email and session token from navigation state (passed from login)
  const locationState = (location?.state as any) || {};
  const email = locationState.email || '';
  const sessionToken = locationState.sessionToken || '';

  // -- State --
  const [digits, setDigits] = React.useState<string[]>(
    Array(codeLength).fill(''),
  );
  const [busy, setBusy] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [verified, setVerified] = React.useState<boolean>(false);
  const [countdown, setCountdown] = React.useState<number>(resendTimeout);
  const [canResend, setCanResend] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);

  // Refs for the individual digit input elements
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer for resend
  React.useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Focus the first input on mount
  React.useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [mounted]);

  const verifyCode = async (code: string) => {
    setBusy(true);
    setError(null);

    try {
      // TODO: Replace with actual reactory API call when server-side 2FA is implemented
      // Expected endpoint: POST /api/2fa/verify
      // Payload: { email, sessionToken, code }
      const response = await fetch(
        `${reactory.getServerUrl?.() || ''}/api/2fa/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-client-key': reactory.getClientKey?.() || '',
          },
          body: JSON.stringify({ email, sessionToken, code }),
        },
      );

      if (!response.ok) {
        throw new Error('INVALID_CODE');
      }

      const result = await response.json();

      // Process the login result
      if (result?.user?.token) {
        setVerified(true);
        await reactory.afterLogin(result);
        setTimeout(() => navigate(redirectTo), 800);
      } else {
        throw new Error('INVALID_RESPONSE');
      }
    } catch (err: any) {
      setBusy(false);
      setError(
        reactory.i18n.t(
          'reactory:2fa.error.invalid_code',
          'Invalid verification code. Please try again.',
        ),
      );
      // Clear digits and refocus
      setDigits(Array(codeLength).fill(''));
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleResend = async () => {
    if (!canResend || busy) return;
    setCanResend(false);
    setCountdown(resendTimeout);
    setError(null);

    try {
      // TODO: Replace with actual reactory API call when server-side 2FA is implemented
      // Expected endpoint: POST /api/2fa/resend
      // Payload: { email, sessionToken }
      await fetch(
        `${reactory.getServerUrl?.() || ''}/api/2fa/resend`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-client-key': reactory.getClientKey?.() || '',
          },
          body: JSON.stringify({ email, sessionToken }),
        },
      );
    } catch (err) {
      reactory.log('Failed to resend 2FA code', { err }, 'warning');
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const sanitized = value.replace(/\D/g, '');
    if (!sanitized && value !== '') return;

    const newDigits = [...digits];

    if (sanitized.length > 1) {
      // Handle paste of full code
      const pasted = sanitized.slice(0, codeLength).split('');
      pasted.forEach((char, i) => {
        if (i < codeLength) newDigits[i] = char;
      });
      setDigits(newDigits);

      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(pasted.length, codeLength - 1);
      inputRefs.current[nextIndex]?.focus();

      // Auto-submit if all fields filled
      if (pasted.length >= codeLength) {
        const code = newDigits.join('');
        if (code.length === codeLength) {
          verifyCode(code);
        }
      }
    } else {
      newDigits[index] = sanitized;
      setDigits(newDigits);

      // Move focus to next input
      if (sanitized && index < codeLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit if all fields filled
      const code = newDigits.join('');
      if (code.length === codeLength && !newDigits.includes('')) {
        verifyCode(code);
      }
    }
  };

  const handleKeyDown = (index: number, evt: React.KeyboardEvent) => {
    if (evt.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move back to previous input
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (evt.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (evt.key === 'ArrowRight' && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (evt: React.ClipboardEvent) => {
    evt.preventDefault();
    const pastedText = evt.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedText) {
      handleDigitChange(0, pastedText);
    }
  };

  const goBack = () => navigate('/login');

  let logoResource = reactory.getTheme().assets?.find((e) => e.name === 'logo');
  if (!logoResource || !logoResource.url) {
    logoResource = { name: 'logo', url: 'https://placehold.it/200x200' };
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
                maxWidth="120px"
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
                  bgcolor: verified ? 'success.main' : 'primary.main',
                  boxShadow: 3,
                  transition: 'background-color 0.3s ease',
                }}
              >
                <Icon sx={{ fontSize: 28 }}>
                  {verified ? 'verified_user' : 'security'}
                </Icon>
              </Avatar>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {reactory.i18n.t(
                  'reactory:2fa.heading',
                  'Two-Factor Authentication',
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {reactory.i18n.t(
                  'reactory:2fa.subheading',
                  'Enter the verification code sent to your email',
                )}
              </Typography>
              {email && (
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ mt: 0.5 }}
                >
                  {email}
                </Typography>
              )}
            </Box>

            {/* Error Alert */}
            <Collapse in={!!error}>
              <Alert
                severity="error"
                onClose={() => setError(null)}
                variant="outlined"
                sx={{ mb: 2, borderRadius: 2 }}
              >
                {error}
              </Alert>
            </Collapse>

            {/* Verified Success */}
            <Collapse in={verified}>
              <Alert
                severity="success"
                variant="outlined"
                sx={{ mb: 2, borderRadius: 2 }}
              >
                {reactory.i18n.t(
                  'reactory:2fa.verified',
                  'Verified successfully! Redirecting...',
                )}
              </Alert>
            </Collapse>

            {/* OTP Input Fields */}
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              sx={{ mb: 3 }}
            >
              {digits.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={busy || verified}
                  variant="outlined"
                  inputProps={{
                    maxLength: index === 0 ? codeLength : 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      padding: '12px 0',
                      width: '40px',
                      letterSpacing: 0,
                    },
                    inputMode: 'numeric',
                    autoComplete: index === 0 ? 'one-time-code' : 'off',
                    'aria-label': `Digit ${index + 1} of ${codeLength}`,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&.Mui-focused': {
                        boxShadow: (theme) =>
                          `0 0 0 2px ${theme.palette.primary.main}40`,
                      },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: digit ? 2 : 1,
                      borderColor: digit ? 'primary.main' : undefined,
                    },
                  }}
                />
              ))}
            </Stack>

            {/* Verify Button (manual submit) */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={
                digits.join('').length !== codeLength || busy || verified
              }
              onClick={() => verifyCode(digits.join(''))}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 2,
                mb: 2,
                '&:hover': { boxShadow: 4 },
              }}
              startIcon={
                busy ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Icon>verified</Icon>
                )
              }
            >
              {busy
                ? reactory.i18n.t('reactory:2fa.verifying', 'Verifying...')
                : reactory.i18n.t('reactory:2fa.verify', 'Verify Code')}
            </Button>

            {/* Resend / Timer */}
            <Box sx={{ textAlign: 'center' }}>
              {canResend ? (
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleResend}
                  underline="hover"
                  fontWeight={600}
                  sx={{ cursor: 'pointer' }}
                >
                  {reactory.i18n.t(
                    'reactory:2fa.resend',
                    'Resend verification code',
                  )}
                </Link>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {reactory.i18n.t(
                    'reactory:2fa.resend_countdown',
                    'Resend code in',
                  )}{' '}
                  <Box component="span" fontWeight={600}>
                    {formatTime(countdown)}
                  </Box>
                </Typography>
              )}
            </Box>

            {/* Back to login */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
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
                {reactory.i18n.t(
                  'reactory:2fa.back_to_login',
                  'Back to Sign In',
                )}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

type TTwoFactorAuth = typeof TwoFactorAuth;

const TwoFactorAuthRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TTwoFactorAuth> = {
  nameSpace: 'core',
  name: 'TwoFactorAuth',
  component: TwoFactorAuth,
  version: '1.0.0',
  roles: ['ANON', 'USER'],
  tags: ['2fa', 'security', 'authentication'],
  componentType: 'form',
  connectors: [],
  title: 'Two-Factor Authentication',
  description:
    'OTP verification component for two-factor authentication. ' +
    'Supports individual digit inputs with paste, auto-submit, ' +
    'countdown timer for resend, and keyboard navigation.',
};

export default TwoFactorAuthRegistration;
