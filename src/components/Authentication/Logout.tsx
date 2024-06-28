

const Logout: React.FunctionComponent<Reactory.IReactoryComponentProps> = (props) => {

  const React = props.reactory.getComponent<Reactory.React>("react.React");
  const ReactRouter = props.reactory.getComponent<Reactory.Routing.ReactRouter>("react-router.ReactRouter");
  const { useNavigate } = ReactRouter;
  const { useEffect } = React;

  const navigate = useNavigate();

  useEffect(() => {
    props.reactory.logout(true);
    navigate("/");
  }, []);

  return (<>...</>)
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