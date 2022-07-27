

const Logout: React.FunctionComponent<Reactory.IReactoryComponentProps> = (props) => {

  const React = props.reactory.getComponent<Reactory.React>("react.React");

  React.useEffect(()=>{
    props.reactory.logout(true);
  }, [])

  return (<>Logging out</>);

}

const LogoutRegistration: Reactory.Client.IReactoryComponentRegistryEntry<typeof Logout> = {
  nameSpace: "core",
  name: "Logout",
  version: "1.0.0",
  component: Logout,
  componentType: "component",
  roles: ["USER"],
  tags: ["user", "logout"]
}

export default LogoutRegistration;