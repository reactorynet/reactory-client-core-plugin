import { ReactoryClientCore } from "types";

const USER_PROFILE_QUERY = `
  query UserProfile($id: String!) {
    userWithId(id: $id) {
      id
      firstName
      lastName
      email
      avatar
    }
  }
`

type UserProfileQueryResult = {
  userWithId?: Reactory.Models.IUser
}

export const DEFAULT_PROFILE_COMPONENTS: ReactoryClientCore.Hooks.ProfileComponentItem[] = [
  {
    componentFqn: "core.ReactoryUserProfileGeneral@1.0.0",
    componentProps: {}
  }
];

const useProfileHook: ReactoryClientCore.Hooks.ProfileHook = (
  { 
    reactory,
    user,
    components = DEFAULT_PROFILE_COMPONENTS,
  }: ReactoryClientCore.Hooks.ProfileHookProps
) => {

  const React = reactory.getComponent<Reactory.React>("react.React");
  const {
    useState,
    useMemo
  } = React;

  const [profile, setProfile] = useState<Partial<Reactory.Client.Models.IUser>>(user);
  const [error, setError] = useState<string | null>(null);
  const load = async () => {
    const { 
      data, 
      error: apolloErrors, 
      errors: graphErrors 
    } = await reactory.graphqlQuery<UserProfileQueryResult, { id: string }>(
      USER_PROFILE_QUERY,
      { id: user.id }
    );

    setProfile(data.userWithId);

    if(apolloErrors || graphErrors) {
      let errorMessage = '';
      if(apolloErrors) {
        errorMessage = apolloErrors.message;
        errorMessage += ' ';
      }
      if(graphErrors) {
        errorMessage += graphErrors.map(e => e.message).join(', ');
      }
      setError(errorMessage.trim());
    }
  }

  let children: any[] = [];

  if(components && components.length > 0) {
    components.forEach(({ componentFqn, componentProps }) => {
      const ComponentToMount: any = reactory.getComponent(componentFqn);
      let $props: any = {
        profile,
        isNew: !profile || !profile.id,
        ...componentProps
      };
      let component = (<ComponentToMount { ...$props } />);
      children.push(component);
    });
  }

  return {
    load,
    profile,
    isNew: profile === null || profile.id === null,
    isOwner: false,
    isAdmin: false,
    loading: true,
    children
  }
}

export default useProfileHook;