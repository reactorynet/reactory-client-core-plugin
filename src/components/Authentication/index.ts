import LoginCardRegistration from './LoginCard';
import RegisterCardRegistration from './RegisterCard';
import ForgotComponentRegistration from './ForgotPassword';
import LogoutRegistration from './Logout';
const authentication: Reactory.Client.IReactoryComponentRegistryEntry<any>[] = [
  LoginCardRegistration,
  RegisterCardRegistration,
  ForgotComponentRegistration,
  LogoutRegistration
];

export default authentication;