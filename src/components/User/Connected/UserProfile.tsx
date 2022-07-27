import Reactory from '@reactory/reactory-core'

interface UserProfileProps extends Reactory.IReactoryComponentProps {
  profileId: string

}

interface UserProfileDependencies {
  ApolloClient: Reactory.Graph.IApolloPackage,
  ReactRouterDom: Reactory.Routing.ReactRouterDom;
  EditProfile: React.FunctionComponent<any>,
  React: Reactory.React
}

const UserProfile = (props: UserProfileProps) => {
  const { reactory, location, profileId, organizationId, match, withPeers, profileTitle, mode } = props
  const { 
    ApolloClient,
    EditProfile,
    ReactRouterDom,
    React,
  } = reactory.getComponents<UserProfileDependencies>([
    "react.React",
    "core.EditProfile",
    "apollo-client.ApolloClient@3.2.7", 
    "react-router.ReactRouterDom"
  ]);

  const {
    nil,
    gql
  } = reactory.utils;

  const params = ReactRouterDom.useParams();

  const { Query } = ApolloClient.components;


  let pid = null;
  pid = nil(profileId) === false ? profileId : params.profileId;
  if (nil(pid) === true) pid = reactory.getUser() ? reactory.getUser().id : null;
  if (nil(pid) === true) return <>No Profile Detected</>

  const query = `query userProfile($profileId: String!){
    userWithId(id: $profileId){
      id
      email
      firstName
      lastName
      mobileNumber
      avatar
      lastLogin
      deleted
      memberships {
        id
        client {
          id
          name
        }
        organization {
          id
          name
        }
        businessUnit {
          id
          name
        }
        created
        lastLogin
        roles
        enabled
      }
      peers {
        organization {
          id
          name
          logo
        }
        user {
          id
          firstName
          lastName
          avatar
          email
        }
        peers {
          user {
            id
            firstName
            lastName
            email
            avatar
          }
          relationship
          isInternal
        }
        allowEdit
      }
    }
  }
`

  return (
    <Query query={gql(query)} variables={{ profileId: pid }} >
      {(queryResults) => {
        const { loading, error, data, refetch } = queryResults;
        debugger
        if (loading) return <p>Loading User Profile, please wait...</p>
        if (error) return <p>{error.message}</p>

        if (data.userWithId) {
          let profileProps = { ...props, profile: { ...data.userWithId }, refetch }
          return <EditProfile  {...profileProps} />
        } else {
          return <p>No user data available</p>
        }
      }}
    </Query>)
};

const UserProfileRegistration: Reactory.Client.IReactoryComponentRegistryEntry<typeof UserProfile> = {
  nameSpace: "core",
  name: "UserProfile",
  version: "1.0.0",
  component: UserProfile,
  componentType: "component",
  tags: ["user", "connected", "profile"],
  roles: ["USER"]
}

export default UserProfileRegistration;