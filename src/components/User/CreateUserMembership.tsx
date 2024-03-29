import ReactAlias from 'react';
import Reactory from "@reactory/reactory-core";

type CreateUserMembershipProps = {
  reactory: Reactory.Client.IReactoryApi;
  user: Reactory.Client.Models.IUser;
  onMembershipCreated?: (membership: Partial<Reactory.Models.IMembership>) => void;
}

interface Organisation {
  id: string;
  name: string;
  logo: string
}

export const CreateUserMembership = (props: CreateUserMembershipProps) => {
  const { reactory, onMembershipCreated } = props;
  const {
    React, 
    ReactoryForm,
    Material, 
    ReactoryMembershipRoles } = reactory.getComponents<{
      React: typeof ReactAlias,
      ReactoryForm: ReactAlias.FC<Partial<Reactory.Forms.IReactoryForm>>,
      Material: Reactory.Client.Web.IMaterialModule,
      ReactoryMembershipRoles: ReactAlias.FC<unknown>
    }>([
      'react.React',
      'react-router.ReactRouterDom',
      'core.ReactoryMembershipRoles',
      'core.ReactoryForm',
      'material-ui.Material']);
  const { useState, useEffect } = React;


  const { MaterialStyles, MaterialCore } = Material;

  const { Paper, TextField, FormControl, InputLabel, Input, InputAdornment, IconButton, Icon } = MaterialCore;

  const [error, setError] = useState(null);
  const [passwordUpdated, setIsPasswordUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    user: reactory.getUser(),
    password: '',
    passwordConfirm: '',
    authToken: localStorage.getItem('auth_token')
  });

  const [organisation, setOrganisations] = useState<Organisation[]>([]);

  

  const classes = MaterialStyles.makeStyles((theme) => {
    return {
      paper: {
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      form_root: {
        marginTop: '10px',
        padding: '24px',
      },
    };
  })();

  const ReactoryRoleSelector = ({ formData = [], onChange }) => {

    return (
      <>
        <ReactoryMembershipRoles 
          user={props.user} 
          membership={{ 
            id: null, 
            organization: null, 
            businessUnit: null, 
            roles: formData }} onChange={(membership) => {
            onChange(membership.roles)
        }} />
      </>
    )
  };

  const roleSelectorRegistryEntry: Reactory.Client.IReactoryComponentRegistryEntry<typeof ReactoryRoleSelector> = {
    nameSpace: 'core',
    name: 'ReactoryRoleSelector',
    component: ReactoryRoleSelector,
    version: '1.0.0',
    componentType: 'widget'
  };

  useEffect(() => {
    reactory.registerComponent(
      roleSelectorRegistryEntry.nameSpace,
      roleSelectorRegistryEntry.name,
      roleSelectorRegistryEntry.version,
      roleSelectorRegistryEntry.component,
      [],
      ["ADMIN"],
      true,
      [],
      roleSelectorRegistryEntry.componentType,
    );
    return () => {
      reactory.unregisterComponent("core.ReactoryRoleSelector@1.0.0");
    };
  }, []);

  const onSubmit = ({ formData, uiSchema, schema, errors, formContext }) => {

    reactory.log(`onSubmit`, { 
      formData, 
      uiSchema, 
      schema, 
      errors, 
      formContext 
    }, 'error');

    const {
      organization,
      businessUnit,
      roles
    } = formData;

    const mutation = `mutation ReactoryCoreCreateUserMembership($user_id:String!, $organization: String, $businessUnit: String, $roles:[String]!) {
      ReactoryCoreCreateUserMembership(user_id: $user_id, organization: $organization, businessUnit: $businessUnit, roles: $roles) {
        id
        organization {
          id
          name
          logo
        }
        businessUnit {
          id
          name
        }
        roles
        created
      }
    }`;

    reactory.graphqlMutation<any, any>(mutation, { user_id: props.user.id, organization, businessUnit, roles }).then(({ data, errors = [] }) => {

      if (errors.length > 0) {
        reactory.log(`Could not create the new the role`, { errors }, 'errors');
      }

      if (data && data.ReactoryCoreCreateUserMembership) {
        const { id, organization, businessUnit, roles } = data.ReactoryCoreCreateUserMembership;

        if (id) {
          let message = '.';
          if (organization) {
            message = ` on ${organization.name}`;

            if (businessUnit) {
              message = `${message} (${businessUnit.name}).`
            }
          }
          reactory.createNotification(`New membership created for ${props.user.firstName} ${props.user.lastName}${message}`, { type: 'success', showInAppNotification: true });
          if(onMembershipCreated) onMembershipCreated({ id, organization, businessUnit, roles })
        }
      }

    }).catch((err) => {
      reactory.log('Graphql Mutation Error Creating New Membership', { err }, 'error');
      reactory.createNotification(`Could not create the membership due to an error`, { type: 'error', showInAppNotification: true });
    });

  }

  const getFormDefinition = () => {

    const base_query = `
    id
    name
    avatarURL
    avatar
    logoURL
    logo,
    businessUnits {
      id
      name
    }
`;


    const MyOrganisationMemberships = `
      query CoreOrganizations  {
        CoreOrganizations {
          ${base_query}
        }
      }  
`;

    const CreateMembershipForm: Reactory.Forms.IReactoryForm = {
      id: 'CreateUserMembership',
      uiFramework: 'material',
      uiSupport: ['material'],
      uiResources: [],
      title: 'Create User Membership',
      tags: ['user management', 'create user role', 'permissions'],
      registerAsComponent: true,
      name: 'CreateUserMembership',
      nameSpace: 'forms',
      version: '1.0.0',
      backButton: false,
      helpTopics: ['create-new-user-role'],
      roles: ['ADMIN'],
      widgetMap: [{
        componentFqn: 'core.ReactoryRoleSelector@1.0.0',
        widget: 'ReactoryRoleSelector'
      }],
      schema: {
        title: 'Create New Membership',
        description: '',
        type: 'object',
        required: [
          'roles',
        ],
        properties: {
          organization: {
            type: 'string',
            title: 'Organization',
          },
          businessUnit: {
            type: 'string',
            title: 'Business Unit'
          },
          roles: {
            type: 'array',
            items: {
              type: 'string',
              title: 'Role'
            }
          },
        },
      },
      uiSchema: {
        "ui:form": {
          submitProps: {
            variant: 'contained',
            iconAlign: 'right',
            title: reactory.i18n.t("reactory.forms.create_membership.submit_title", "ADD MEMBERSHIP"),
          },
          submitIcon: 'shield_person',          
        },
        organization: {
          'ui:widget': 'SelectWithDataWidget',
          'ui:options': {
            multiSelect: false,
            query: MyOrganisationMemberships,
            resultItem: 'CoreOrganizations',
            resultsMap: {
              'CoreOrganizations.[].id': ['[].key', '[].value'],
              'CoreOrganizations.[].name': '[].label',
            },
          },
        },
        businessUnit: {
          'ui:widget': 'SelectWithDataWidget',
          'ui:options': {
            multiSelect: false,
            query: `
            query CoreOrganization($id: String!) {
              CoreOrganization(id: $id) {
                id
                businessUnits {
                  id
                  name
                }
              }
            }`,
            propertyMap: {
              'formContext.formData.organization': 'id'
            },
            resultItem: 'CoreOrganization',
            resultsMap: {
              'CoreOrganization.businessUnits[].id': ['[].key', '[].value'],
              'CoreOrganization.businessUnits[].name': '[].label'
            },
          },
        },
        roles: {
          'ui:widget': 'ReactoryRoleSelector',
        }
      },
      defaultFormValue: {
        roles: ['USER']
      }
    };

    return CreateMembershipForm;
  }

  const onValidate = (formData, errors, formContext, method) => {
    return errors;
  }

  return (
    <Paper elevation={1} className={classes.paper}>
      {/* YOUR COMPONENTS HERE */}
      <ReactoryForm
        className={classes.form_root}
        formDef={getFormDefinition()}
        validate={onValidate}
        liveValidate={true}
        onSubmit={onSubmit}
        formData={formData} />
    </Paper>
  )

};

const ReactoryCreateUserMembershipRegistryEntry: Reactory.Client.IReactoryComponentRegistryEntry<typeof CreateUserMembership> = {
  nameSpace: 'core',
  name: 'ReactoryCreateUserMembership',
  component: CreateUserMembership,
  version: '1.0.0',
  componentType: 'form'
}

export default ReactoryCreateUserMembershipRegistryEntry