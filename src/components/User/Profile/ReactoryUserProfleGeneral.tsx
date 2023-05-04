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
      fields: {
        ReactoryImageField: ({children}) => { return <>{children}</> },
      },
      uiSchema: {
        'ui:form': {
          title: i18n.t('reactory.profile.general.title', "General"),
          submitProps: {
            variant: 'contained',
            color: 'primary',
          }
        },
        'ui:field': 'GridLayout',
        'ui:grid-layout': [
          {
            avatar: { md: 12, sm: 12, xs: 12 },
            firstName: { md: 6, sm: 12, xs: 12 },
            lastName: { md: 6, sm: 12, xs: 12 },
            email: { md: 12, sm: 12, xs: 12 },
          }
        ],
        avatar: {
          'ui:widget': 'ReactoryImageWidget',
          'ui:field': 'ReactoryImageField',
          'ui:title': '',
          'ui:options': {
            variant: 'avatar',
            uploader: 'core.ReactoryProfileUploader@1.0.0',
            className: 'AvatarRoot',
            jss: {
              AvatarRoot: {
                width: '100%',
                height: '100%',
              }
            }
          }
        }
      }
    };
    
    return (
      <ReactoryForm formDef={formDef} data={profile} />
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
