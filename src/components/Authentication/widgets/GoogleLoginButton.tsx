import Reactory from '@reactorynet/reactory-core';

interface GoogleLoginButtonProps {
  reactory: Reactory.Client.IReactoryApi;
  url: string;
}

const GoogleLoginButton: React.FunctionComponent<GoogleLoginButtonProps> = (props) => {
  const { reactory, url } = props;

  const { React, Material } = reactory.getComponents<{
    React: Reactory.React;
    Material: Reactory.Client.Web.IMaterialModule;
  }>([
    'react.React',
    'material-ui.Material@1.0.0',
  ]);

  const { Button, Icon, SvgIcon } = Material.MaterialCore;

  const GoogleIcon = () => (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </SvgIcon>
  );

  const startAuth = () => {
    const formattedUrl = reactory.utils.lodash.template(url)({ reactory });
    window.location.replace(formattedUrl);
  };

  return (
    <Button
      onClick={startAuth}
      variant="outlined"
      fullWidth
      startIcon={<GoogleIcon />}
      sx={{
        borderRadius: 2,
        py: 1.2,
        textTransform: 'none',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: 'text.primary',
        borderColor: 'divider',
        '&:hover': {
          borderColor: 'text.secondary',
          backgroundColor: 'action.hover',
        },
      }}
    >
      {reactory.i18n.t('reactory:login.with_google', 'Continue with Google')}
    </Button>
  );
};

type TGoogleLoginButton = typeof GoogleLoginButton;

const GoogleLoginButtonRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TGoogleLoginButton> = {
  component: GoogleLoginButton,
  name: 'GoogleLoginButton',
  nameSpace: 'core',
  version: '1.0.0',
  roles: ['ANON'],
  title: 'Google Login Button',
  tags: ['login', 'google'],
  componentType: 'widget',
  description: 'Google Authentication Button. This component is used to authenticate users using Google.',
};

export default GoogleLoginButtonRegistration;