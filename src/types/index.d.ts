import React from "react"
declare namespace ReactoryClientCore {

  export type ProfileComponent = React.FC<any> | React.Component<any, any, any> | React.PureComponent<any, any, any> | symbol

  export type ProfileComponents = ProfileComponent[]
  export namespace Hooks {

    export interface ProfileHookReturn {
      /**
       * Loads the profile data
       * @returns 
       */
      load: () => Promise<void>
      profile?: Partial<Reactory.Client.Models.IUser>
      isNew: boolean
      loading: boolean
      isOwner: boolean
      isAdmin: boolean
      children?: any[]
    }

    export interface ProfileComponentItem {
      componentFqn: string,
      componentProps?: object
    }

    export interface ProfileHookProps {
      reactory: Reactory.Client.IReactoryApi
      user: Partial<Reactory.Models.IUser>
      components?: ProfileComponentItem[],
    }

    export type ProfileHook = (props: ProfileHookProps) => ProfileHookReturn 
  }
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

    export interface ReactoryUserProfileProperties {
      user: Partial<Reactory.Models.IUser>,
      reactory: Reactory.Client.IReactoryApi,
      components?: ProfileComponentItem[],
      jss?: any,
    }
    
    export interface ReactoryUserProfileGenericProperties {
      profile: Partial<Reactory.Models.IUser>
      reactory: Reactory.Client.IReactoryApi
      jss?: any
      isAdmin: boolean
      isOwner: boolean
      isNew: boolean
      loading: boolean
    }
  }
}