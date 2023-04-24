import React from 'react';
import Reactory from '@reactory/reactory-core';
import { ReactoryClientCore } from 'types';

const ReactoryUserProfileGeneral = (props: ReactoryClientCore.Components.ReactoryUserProfileGenericProperties) => {
  
    const { reactory, profile, loading, isAdmin, isNew, isOwner } = props;
    const {
      i18n,
      getUser,
    } = reactory;
    const { ReactoryForm } = reactory.getComponents<{
      ReactoryForm: React.FunctionComponent<Reactory.Client.IReactoryFormProps>,
    } >([
      'react.React',
      'core.ReactoryForm'
    ]);
    const { useState } = React;
    
    const formDef: Reactory.Forms.IReactoryForm = {
      id: 'reactory-user-profile-general',
      name: 'ReactoryUserProfileGeneral',
      title: 'General',
      nameSpace: 'core',
      version: '1.0.0',
      schema: {
        title: i18n.t('reactory.profile.general.title', "General"),
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            title: i18n.t('reactory.profile.firstName', "First Name"),
          },
          lastName: {
            type: 'string',
            title: i18n.t('reactory.profile.lastName', "Last Name"),
          },
          email: {
            type: 'string',
            title: i18n.t('reactory.profile.email', "Email"),
          },
          avatar: {
            type: 'string',
            title: i18n.t('reactory.profile.avatar', "Avatar"),
          },
        },
      },
    };
    
    return (
      <ReactoryForm formDef={formDef} />
    );
}

const ReactoryUserProfileGeneralRegistration: Reactory.Client.IReactoryComponentRegistryEntry<typeof ReactoryUserProfileGeneral> = {  
  name: 'ReactoryUserProfileGeneral',
  nameSpace: 'core',
  version: '1.0.0',
  component: ReactoryUserProfileGeneral,
  tags: ['user', 'profile', 'general'],
  roles: ['USER'],
  title: 'User Profile General',
}

export default ReactoryUserProfileGeneralRegistration;
