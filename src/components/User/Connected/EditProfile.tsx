



const EditProfile: React.FunctionComponent<Reactory.Plugins.ClientCore.Components.EditProfileProps> = (props) => {
  const { reactory, organizationId, surveyId, profile, onCancel, withPeers, profileTitle, mode, headerComponents, footerComponents, refetch } = props
  
  const {
    React,
    ApolloClient,
    Profile
  } = reactory.getComponents<Reactory.Plugins.ClientCore.Components.EditProfileDependencies>([
    "apollo-client.ApolloClient@3.2.7",
    "core.Profile",
    "react.React"
  ])
  
  const { Mutation } = ApolloClient.components;

  const mutation = reactory.utils.gql(`
  mutation UpdateUserMutation($id: String!, $profileData: UpdateUserInput!){
    updateUser(id: $id, profileData: $profileData){
      id
      firstName
      lastName
      email
      mobileNumber
      avatar
    }
  }
  `);

  const apiStatus = `
  query status {
      apiStatus {
      applicationName
      applicationAvatar
      applicationRoles
      when
      status
      firstName
      lastName
      email
      avatar
      roles
      organization {
        id
        name
        logo
      }
      businessUnit {
        id
        name
        avatar
      }
      memberships {
        id
        client {
          id
          name
        }
        organization {
          id
          name
          logo
        }
        businessUnit {
          id
          name
          avatar
        }
        roles
      }
      id
      theme
      activeTheme {
        id
        type
        name
        nameSpace
        version
        description
        modes {
          id
          name
          description
          icon
        }
        options
        assets {
          id
          name
          assetType
          url
          loader
          options
          data
        }        
      }
      themes {
        id
        type
        name
        nameSpace
        version
        description        
      }
      server {
        id
        version,
        started,
        clients {
          id
          clientKey
          name
          siteUrl
        }
      }
      colorSchemes
      routes {
        id
        path
        public
        roles
        componentFqn
        exact
        redirect
        args {
          key
          value
        }
        component {
          nameSpace
          name
          version
          args {
            key
            value
          }
          title
          description
          roles
        }
      }
      menus {
        id
        key
        name
        target
        roles
        entries {
          id
          ordinal
          title
          link
          external
          icon
          roles
          items {
            id
            ordinal
            title
            link
            external
            icon
            roles
          }
        }

      }
      messages {
        id
        title
        text
        data
        via
        icon
        image
        requireInteraction
        silent
        timestamp
        actions {
          id
          action
          icon
          componentFqn
          componentProps
          modal
          modalSize
          priority
        }
      }
      navigationComponents {
				componentFqn
				componentProps
				componentPropertyMap
				componentKey
				componentContext
        contextType
			}
    }
  }
  `

  return (
    <Mutation mutation={mutation} >
      {(updateUser, result) => {

        const { loading, error } = result;

        let _props = {
          loading,
          error,
          profile,
          withPeers,
          mode,
          isNew: false,
          onCancel,
          profileTitle,
          organizationId,
          surveyId,
          footerComponents,
          headerComponents,
          refetch,
          reactory,
          onPeersConfirmed: () => {},
          onSave: (profileData) => {
            let profileDataInput = reactory.utils.omitDeep(profileData);
            delete profileDataInput.peers
            updateUser({
              variables: {
                id: profile.id,
                profileData: profileDataInput,
              },
              refetchQueries: [{ query: apiStatus, options: { fetchPolicy: 'network-only' } }]
            });
          }
        }

        if (loading) return (<p>Updating... please wait</p>)
        if (error) return (<p>{error.message}</p>)

        return <Profile {..._props} />
      }}
    </Mutation>
  )
};

const EditProfileRegistration: Reactory.Client.IReactoryComponentRegistryEntry<typeof EditProfile> = {
  nameSpace: "core",
  name: "EditProfile",
  version: "1.0.0",
  component: EditProfile
};

export default EditProfileRegistration;