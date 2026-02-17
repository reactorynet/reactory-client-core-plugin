import Reactory from '@reactorynet/reactory-core';

export interface ReactoryMembershipRolesProps {
  membership: Reactory.Models.IMembership,
  user: Reactory.Client.Models.IUser,
  onChange: (membership: Reactory.Models.IMembership) => void,
  auto_update: boolean,
  reactory: Reactory.Client.IReactoryApi
}

const ReactoryMembershipRoles = (props: ReactoryMembershipRolesProps) => {
  const { 
    reactory,
    user, 
    membership, 
    auto_update, 
    onChange
  } = props;
  const { id = null } = membership;
  const is_new = id === null;

  const { React, MaterialCore } = reactory.getComponents<{
    React: Reactory.React,
    MaterialCore: Reactory.Client.Web.MaterialCore
  }>(['react.React', 'material-ui.MaterialCore']);
  const {
    Grid,
    FormControlLabel,
    Switch,
  } = MaterialCore


  return (
    <Grid container>
      {membership && reactory.$user.applicationRoles.map((applicationRole: string) => {
        const onToggleRole = (evt) => {
          let roles = [...membership.roles];        
          if (evt.target.checked === false) {
            //remove the role
            reactory.utils.lodash.remove(roles, r => r === applicationRole);
          } else {
            roles.push(applicationRole);
          }
          if (is_new) {
            if (typeof onChange === 'function') {
              onChange({ ...membership, roles });
            }
          } else {
            if (auto_update === true) {
              const mutation = `
                      mutation SetMembershipRoles($user_id: String!, $id: String!, $roles: [String]!){
                          ReactoryCoreSetRolesForMembership(user_id: $user_id, id: $id, roles: $roles) {
                              success
                              message
                              payload
                          }
                      }`;

              const variables = {
                user_id: user.id,
                id: membership.id,
                roles: roles
              };


              reactory.graphqlMutation<any, any>(mutation, variables).then(({ data, errors = [] }) => {
                if (errors.length > 0) {
                  reactory.createNotification('Could not update the user roles.', { type: 'error', showInAppNotification: true });
                }

                if (data && data.SetMembershipRoles) {
                  const { success, message, payload } = data.SetMembershipRoles;              
                  if (success === true) {
                    if (typeof onChange === 'function') {
                      onChange({ ...membership, roles });
                    }
                  } else {
                    reactory.createNotification('Could not update the user roles.', { type: 'error', showInAppNotification: true });
                  }
                }

              }).catch((error) => {
                reactory.log('Could not process request', { error }, 'error');
                reactory.createNotification('Could not update the user roles.', { type: 'error', showInAppNotification: true })
              })
            }
          }
        }

        if (applicationRole !== 'ANON') {
          return (<Grid item xs={12} sm={12} md={12} lg={12}>
            <FormControlLabel
              control={<Switch size="small" checked={reactory.hasRole([applicationRole], membership.roles)} onChange={onToggleRole} />}
              label={applicationRole}
            />

          </Grid>)
        }

      })}
    </Grid>
  )
}

export default {
  nameSpace: 'core',
  name: 'ReactoryMembershipRoles',
  component: ReactoryMembershipRoles,
  version: '1.0.0',
  roles: ['ADMIN'],
  componentType: 'component'
}