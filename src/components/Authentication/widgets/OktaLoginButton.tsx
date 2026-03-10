import Reactory from '@reactorynet/reactory-core';

interface OktaLoginButtonProps {
  reactory: Reactory.Client.IReactoryApi;
  url: string;
}

const OktaLoginButton: React.FunctionComponent<OktaLoginButtonProps> = (props) => {
  const { reactory, url } = props;

  const { React, Material } = reactory.getComponents<{
    React: Reactory.React;
    Material: Reactory.Client.Web.IMaterialModule;
  }>([
    'react.React',
    'material-ui.Material@1.0.0',
  ]);

  const { Button, SvgIcon } = Material.MaterialCore;

  const OktaIcon = () => (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
      <path
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
        fill="#007DC1"
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
      startIcon={<OktaIcon />}
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
      {reactory.i18n.t('reactory:login.with_okta', 'Continue with Okta')}
    </Button>
  );
};

type TOktaLoginButton = typeof OktaLoginButton;

const OktaLoginButtonRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TOktaLoginButton> = {
  component: OktaLoginButton,
  name: 'OktaLoginButton',
  nameSpace: 'core',
  version: '1.0.0',
  roles: ['ANON'],
  title: 'Okta Login Button',
  tags: ['login', 'okta'],
  componentType: 'widget',
  description: 'Okta Authentication Button. This component is used to authenticate users using Okta SSO.',
};

export default OktaLoginButtonRegistration;