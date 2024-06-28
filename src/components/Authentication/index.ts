import LoginCardRegistration from './LoginCard';
import RegisterCardRegistration from './RegisterCard';
import ForgotComponentRegistration from './ForgotPassword';
import LogoutRegistration from './Logout';
import AuthenticationWidgets from './widgets';
const authentication: Reactory.Client.IReactoryComponentRegistryEntry<any>[] = [
  LoginCardRegistration,
  RegisterCardRegistration,
  ForgotComponentRegistration,
  LogoutRegistration,
  ...AuthenticationWidgets
];

export default authentication;