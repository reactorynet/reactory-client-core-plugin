import schema from './schema';
import uiSchema from './uiSchema';
import graphql from './graphql';



const UserImportFormDefinition = {
  id: 'core.UserImportForm',
  name: 'UserImportForm',
  uiFramework: 'material',
  uiSupport: ['material'],
  helpTopics: ['core-user-import-form'],
  schema,
  graphql,
  uiSchema,
}

const UserImportForm = (props: any) => {

  const { reactory, organization, onImportSuccess } = props;

  if (!organization) {
    throw new Error('Component Requires Organization');
  }

  const {
    React,
    MaterialCore,
    ReactoryForm
  } = reactory.getComponents(['react.React', 'material-ui.MaterialCore', 'core.ReactoryForm']);

  /**
   * 
   * @param formData 
   * @returns 
   */
  const onBeforeMutation = (mutationProps: any, form: any, formContext: any) => {

    const icon = `${reactory.ThemeResource('images/favicon.ico')}`

    reactory.createNotification('Not ready', { type: 'warning', showInAppNotification: false, text: 'Not ready yet to perform this action', icon })
    //return false not ready
    return false;
  }

  const onMutateComplete = (workload, context, { data, errors = [] }) => {
    debugger;

    if (onImportSuccess) onImportSuccess(true);
  };

  return (
    <ReactoryForm
      formDef={UserImportFormDefinition}
      mode={'edit'}
      organization={organization}
      formData={{ organization_id: organization.id }}
      onBeforeMutation={onBeforeMutation}
      onMutateComplete={onMutateComplete}
    />
  )
}

export default {
  nameSpace: 'core',
  name: 'UserImportForm',
  component: UserImportForm,
  version: '1.0.0',
  componentType: 'form',
  roles: ['ADMIN', 'DEVELOPER']
}