
import GoogleLoginButtonRegistration from "./GoogleLoginButton";
import MicrosoftLoginButtonRegistration from "./MicrosoftLoginButton";
import GitHubLoginButtonRegistration from "./GitHubLoginButton";
import OktaLoginButtonRegistration from "./OktaLoginButton";

const widgets: Reactory.Client.IReactoryComponentRegistryEntry<any>[] = [
  GoogleLoginButtonRegistration,
  MicrosoftLoginButtonRegistration,
  GitHubLoginButtonRegistration,
  OktaLoginButtonRegistration,
];
export default widgets;