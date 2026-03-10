import Reactory from '@reactorynet/reactory-core';

interface GitHubLoginButtonProps {
  reactory: Reactory.Client.IReactoryApi;
  url: string;
}

const GitHubLoginButton: React.FunctionComponent<GitHubLoginButtonProps> = (props) => {
  const { reactory, url } = props;

  const { React, Material } = reactory.getComponents<{
    React: Reactory.React;
    Material: Reactory.Client.Web.IMaterialModule;
  }>([
    'react.React',
    'material-ui.Material@1.0.0',
  ]);

  const { Button, SvgIcon } = Material.MaterialCore;

  const GitHubIcon = () => (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
      <path
        d="M12 1.27a11 11 0 0 0-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2.16 2.16 0 0 1 .64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.09-2.76a3.56 3.56 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5.02 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.29.2 2.4.1 2.64.73.73 1.09 1.65 1.09 2.76 0 4.04-2.47 4.96-4.94 5.23.37.36.73.92.73 1.84v2.75c0 .36.18.64.73.55A11 11 0 0 0 12 1.27"
        fill="currentColor"
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
      startIcon={<GitHubIcon />}
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
      {reactory.i18n.t('reactory:login.with_github', 'Continue with GitHub')}
    </Button>
  );
};

type TGitHubLoginButton = typeof GitHubLoginButton;

const GitHubLoginButtonRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TGitHubLoginButton> = {
  component: GitHubLoginButton,
  name: 'GitHubLoginButton',
  nameSpace: 'core',
  version: '1.0.0',
  roles: ['ANON'],
  title: 'GitHub Login Button',
  tags: ['login', 'github'],
  componentType: 'widget',
  description: 'GitHub Authentication Button. This component is used to authenticate users using GitHub.',
};

export default GitHubLoginButtonRegistration;