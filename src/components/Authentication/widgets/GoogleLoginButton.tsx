import Reactory from '@reactory/reactory-core';

interface GoogleLoginButtonProps {
  reactory: Reactory.Client.IReactoryApi; 
  url: string;
}

const GoogleLoginButton: React.FunctionComponent<GoogleLoginButtonProps> = (props: GoogleLoginButtonProps) => {
  
  const { reactory, url } = props;
  reactory.log(`GoogleLoginButton start`, { url });
  const { 
    React,
    Material,
    ReactRouterDom
  } = reactory.getComponents<{
    React: Reactory.React,
    Material: Reactory.Client.Web.IMaterialModule,
    ReactRouterDom: Reactory.Routing.ReactRouterDom,
  }>([
    'react.React',
    'material-ui.Material@1.0.0',
    'react-router.ReactRouterDom@1.0.0',
  ]);

  

  const startGoogleAuth = () => { 
    const formattedUrl = reactory.utils.lodash.template(url)({ reactory });
    reactory.log(`GoogleLoginButton formattedUrl`, { formattedUrl });
    window.location.replace(formattedUrl);
  }
  
  return (
    <React.Fragment key={'google_login_button'}>
      <Material.MaterialCore.Tooltip title={reactory.i18n.t('reactory:login.with.google.cta.tooltip', 'Login with Google')}>
        <Material.MaterialCore.IconButton 
          onClick={startGoogleAuth}>
            <Material.MaterialIcons.Google />
        </Material.MaterialCore.IconButton>
      </Material.MaterialCore.Tooltip>
    </React.Fragment>
  )
}

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
  description: 'Google Authentication Button. This component is used to authenticate users using Google.'
};

export default GoogleLoginButtonRegistration;