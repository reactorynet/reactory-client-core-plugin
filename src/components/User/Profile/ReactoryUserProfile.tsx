import Reactory from '@reactory/reactory-core';
import { ReactoryClientCore } from 'types';
import useProfileHook, { DEFAULT_PROFILE_COMPONENTS } from '../hooks/useProfile';

const DEPS = ['react.React', 'material-ui.Material'];
type DEPS_TYPES = {
  React: Reactory.React,
  Material: Reactory.Client.Web.IMaterialModule
};

export const ReactoryUserProfile: Reactory.Client.ReactoryFC<ReactoryClientCore.Components.ReactoryUserProfileProperties> = (props) => {

  const { reactory, jss = {}, components = [] } = props;
  const { React, Material } = reactory.getComponents<DEPS_TYPES>(DEPS);
  const { useState, useEffect } = React;
  let $user = props.user || reactory.getUser();
  const { 
    isAdmin,
    isNew,
    isOwner,
    load,
    loading,
    profile,
    children  
  } = useProfileHook({ 
    reactory, 
    user: $user 
  });

  const { MaterialStyles, MaterialCore } = Material;
  const {
    Paper,
    Typography,
  } = MaterialCore;

  const styles = MaterialStyles.createStyles((theme: { spacing: (arg0: number) => any; }) => ({
    root: {
      padding: theme.spacing(2),
      margin: theme.spacing(2),
    },
    title: {
      marginBottom: theme.spacing(2),
    }
  }));

  return (
    <Paper>
      <Typography variant='h3' classes={styles}>
        {reactory.i18n.t('reactory.profile.title', "Profile")}
      </Typography>
      {children}
    </Paper>
  )
};

const ReactoryUserProfileRegistration: Reactory.Client.IReactoryComponentRegistryEntry<typeof ReactoryUserProfile> = {
  name: 'ReactoryUserProfile',
  component: ReactoryUserProfile,
  version: '1.0.0',
  nameSpace: 'core',
  roles: ['USER'],
  tags: ['user', 'profile'],
  title: 'User Profile',
  description: 'User Profile',
};

export default ReactoryUserProfileRegistration;