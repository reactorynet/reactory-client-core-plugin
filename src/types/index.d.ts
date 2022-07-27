
declare namespace Reactory {
  export namespace Plugins {
    export namespace ClientCore {

      export namespace Components {
        export interface EditProfileProps extends Reactory.IReactoryComponentProps {

        }

        export interface ProfileProps extends Reactory.IReactoryComponentProps {
          profile: Reactory.Models.IUser,
          profileTitle: string,
          loading: boolean,
          organizationId: string,
          onPeersConfirmed?: () => void
          mode: string,
          isNew: boolean,
          onCancel: () => void,
          onSave: (profile: Reactory.Models.IUser) => void,
          withPeers?: boolean,
          withAvatar?: boolean,
          withMembership?: boolean,
          withBackButton?: boolean,
          firstNameHelperText?: string,
          surnameHelperText?: string,
          emailHelperText?: string,
          headerComponents?: string,
          footerComponents?: string,
          refetch?: () => void
        }

        export interface EditProfileDependencies {
          React: React,
          ApolloClient: Reactory.Graph.IApolloPackage,
          Profile: React.FunctionComponent<ProfileProps>
        }
      }

    }
  }
}