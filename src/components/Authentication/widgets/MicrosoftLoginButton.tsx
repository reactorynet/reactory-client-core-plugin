import Reactory from '@reactorynet/reactory-core';

interface MicrosoftLoginButtonProps {
  reactory: Reactory.Client.IReactoryApi;
  url: string;
}

const MicrosoftLoginButton: React.FunctionComponent<MicrosoftLoginButtonProps> = (props) => {
  const { reactory, url } = props;

  const { React, Material } = reactory.getComponents<{
    React: Reactory.React;
    Material: Reactory.Client.Web.IMaterialModule;
  }>([
    'react.React',
    'material-ui.Material@1.0.0',
  ]);

  const { Button, SvgIcon } = Material.MaterialCore;

  const MicrosoftIcon = () => (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
      <path d="M1 1h10v10H1z" fill="#F25022" />
      <path d="M13 1h10v10H13z" fill="#7FBA00" />
      <path d="M1 13h10v10H1z" fill="#00A4EF" />
      <path d="M13 13h10v10H13z" fill="#FFB900" />
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
      startIcon={<MicrosoftIcon />}
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
      {reactory.i18n.t('reactory:login.with_microsoft', 'Continue with Microsoft')}
    </Button>
  );
};

type TMicrosoftLoginButton = typeof MicrosoftLoginButton;

const MicrosoftLoginButtonRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TMicrosoftLoginButton> = {
  component: MicrosoftLoginButton,
  name: 'MicrosoftLoginButton',
  nameSpace: 'core',
  version: '1.0.0',
  roles: ['ANON'],
  title: 'Microsoft Login Button',
  tags: ['login', 'microsoft'],
  componentType: 'widget',
  description: 'Microsoft Authentication Button. This component is used to authenticate users using Microsoft.',
};

export default MicrosoftLoginButtonRegistration;