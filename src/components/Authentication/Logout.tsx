import Reactory from '@reactorynet/reactory-core';

interface ILogoutDependencies {
  React: Reactory.React;
  Material: Reactory.Client.Web.IMaterialModule;
  ReactRouter: Reactory.Routing.ReactRouter;
}

/**
 * Logout component with a brief visual transition before redirecting.
 * Calls `reactory.logout()` and navigates to the root route.
 */
const Logout: React.FunctionComponent<Reactory.IReactoryComponentProps> = (props) => {
  const { reactory } = props;

  const {
    React,
    Material,
    ReactRouter,
  } = reactory.getComponents<ILogoutDependencies>([
    'react.React',
    'material-ui.Material@1.0.0',
    'react-router.ReactRouter',
  ]);

  const { useNavigate } = ReactRouter;
  const { useEffect, useState } = React;

  const {
    Avatar,
    Box,
    CircularProgress,
    Fade,
    Icon,
    Typography,
  } = Material.MaterialCore;

  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    reactory.logout(true);
    // Brief visual delay before redirecting
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => navigate('/'), 400);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fade in={visible} timeout={400}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
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
        }}
      >
        <Avatar
          sx={{
            width: 72,
            height: 72,
            mb: 3,
            bgcolor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Icon sx={{ fontSize: 36, color: 'common.white' }}>logout</Icon>
        </Avatar>
        <Typography
          variant="h6"
          sx={{ color: 'common.white', mb: 2, fontWeight: 300 }}
        >
          {reactory.i18n.t('reactory:logout.message', 'Signing you out...')}
        </Typography>
        <CircularProgress
          size={24}
          sx={{ color: 'rgba(255,255,255,0.7)' }}
        />
      </Box>
    </Fade>
  );
};

const LogoutRegistration: Reactory.Client.IReactoryComponentRegistryEntry<typeof Logout> = {
  nameSpace: 'core',
  name: 'Logout',
  version: '1.0.0',
  component: Logout,
  componentType: 'component',
  roles: ['USER'],
  tags: ['user', 'logout'],
};

export default LogoutRegistration;