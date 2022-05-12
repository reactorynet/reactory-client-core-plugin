import { nameSpace } from '../../constants';
import Reactory from '@reactory/reactory-core'
import { IReactoryComponentProps } from '@reactory/reactory-core/src/types';
const dependencies = [
  'material-ui.Material',
  'core.ReactoryForm',
];


const froalaOptions = {
  key: 'SDB17hB8E7F6D3eMRPYa1c1REe1BGQOQIc1CDBREJImD6F5E4G3E1A9D7C3B4B4==',
  imageManagerLoadMethod: 'GET',
  imageDefaultWidth: 300,
  imageDefaultDisplay: 'inline',
  imageUploadMethod: 'POST',
  fileUploadURL: '${formContext.api.API_ROOT}/froala/upload/file',
  videoUploadURL: '${formContext.api.API_ROOT}/froala/upload/video',
  imageUploadURL: '${formContext.api.API_ROOT}/froala/upload/image',
  requestHeaders: {
    'x-client-key': '${formContext.api.CLIENT_KEY}',
    'x-client-pwd': '${formContext.api.CLIENT_PWD}',
  },
};

const $schema = {
  title: 'Email Template',
  type: 'object',
  properties: {

    view: {
      type: 'string',
      title: 'key'
    },

    name: {
      type: 'string',
      title: 'Template Name'
    },

    description: {
      type: 'string',
      title: 'Template Description'
    },

    reactoryClient: {
      type: 'object',
      title: 'Reactory Client',
      description: 'Restricts this template to this client',
      properties: {
        id: {
          type: 'string',
          title: 'Reactory Client Id',
        },
        name: {
          type: 'string',
          title: 'Reactory Client Name',
        }
      }
    },

    organization: {
      type: 'object',
      title: 'Organisation',
      description: 'Restricts this template to this organisation',
      properties: {
        id: {
          type: 'string',
          title: 'Organization id',
        },

        name: {
          type: 'string',
          title: 'Organisation Name',
        },
      },
    },

    businessUnit: {
      type: 'object',
      title: 'Business Unit',
      description: 'Restricts this template to this business unit',
      properties: {
        id: {
          type: 'string',
          title: 'Business Unit Id',
        },

        name: {
          type: 'string',
          title: 'Business Unit name',
        },
      },
    },

    subject: {
      type: 'string',
      title: 'Subject Line',
    },

    body: {
      type: 'string',
      title: 'Body'
    },

    footer: {
      type: 'string',
      title: 'Footer'
    },

  }
};

const $uiSchema = {
  'ui:field': 'GridLayout',
  'ui:grid-layout': [
    {
      name: { sm: 12, md: 3 },
      description: { sm: 12, md: 3 },
      view: { sm: 12, md: 3 },
    },
    
    {
      subject: { md: 12 },
    },

    {

      body: { md: 12 },
    },

    {
      reactoryClient: { sm: 12, md: 3 },
      organization: { sm: 12, md: 3 },
      businessUnit: { sm: 12, md: 3 },
    },
  ],
  reactoryClient: {
    'ui:widget': 'ReactoryClientSelector',
    'ui:options': {
      props: {
        variant: 'dropdown',
        allowNull: false,
        source: 'memberships'
      }
    }
  },
  organization: {
    'ui:widget': 'ReactoryOrganizationSelector',
    'ui:options': {
      props: {
        variant: 'dropdown',
        allowNull: true,
        source: 'memberships',
      }
    }
  },
  businessUnit: {
    'ui:widget': 'ReactoryBusinessUnitSelector',
    'ui:options': {
      props: {
        variant: 'dropdown',
        allowNull: true,
        source: 'memberships'
      }
    }
  },
  name: {

  },
  description: {

  },
  view: {
    'ui:widget': 'LabelWidget',
    'ui:options': {
      format: 'View name: ${formData}'
    }
  },
  subject: {

  },
  body: {
    'ui:widget': 'FroalaWidget',
    'ui:options': {
      froalaOptions,
    },
  },


  reactoryClient: {
    'ui:widget': 'ClientSelector',
  },
  organization: {
    'ui:widget': 'OrganizationSelector',
  },
  businessUnit: {
    'ui:widget': 'BusinessUnitSelector',
  },
}

const $graphql = {
  query: {
    edit: true,
    new: true,
    edit: true,
    delete: false,
    text: `query ReactoryGetEmailTemplate ($view: String, $clientId: String, $organizationId: String, $businessUnitId: String, $userId: String) {
        ReactoryGetEmailTemplate (view: $view, clientId: $clientId, organizationId: $organizationId, businessUnitId: $businessUnitId, userId: $userId) {
          id
          name
          description
          reactoryClient {
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
          view
          subject 
          body
        }
      }`,
    name: 'ReactoryGetEmailTemplate',
    queryMessage: 'Loading Template',
    resultMap: {
      'id': 'id',
      'name': 'name',
      'description': 'description',
      'reactoryClient': 'reactoryClient',
      'organization': 'organization',
      'businessUnit': 'businessUnit',
      'view': 'view',
      'subject': 'subject',
      'body': 'body',
    },
    variables: {
      'formData.view': 'view',
      'formData.reactoryClient.id': 'clientId',
      'formData.organization.id': 'organizationId',
      'formData.businessUnit.id': 'businessUnitId',
      'formData.user.id': 'userId',
    }
  },
  mutation: {
    edit: {
      name: "ReactorySetEmailTemplate",
      text: `mutation ReactorySetEmailTemplate($emailTemplate: EmailTemplateInput){
        ReactorySetEmailTemplate(emailTemplate: $emailTemplate){
          id
          name
          description
          view
          subject 
          body
        }
      }`,
      objectMap: true,
      updateMessage: 'Updating Email Template ${formData.name}',
      variables: {
        'formData': 'emailTemplate'
      },      
    }
  }
};

export const ReactoryEmailTemplateEditorErrorHandler = (props, context) => {



  return {
    handleError: (errors) => {

    }
  }
}

export const ReactoryEmailTemplateEditor: Reactory.Forms.IReactoryForm = {
  id: "ReactoryEmailTemplateEditor",
  nameSpace: 'reactory-core',
  name: "ReactoryEmailTemplateEditorForm",
  version: "1.0.0",
  title: "Email Template Editor",
  description: "Form used to edit a email template",
  helpTopics: ['reactory-core.ReactoryEmailTemplateEditorForm@1.0.0-help'],
  uiFramework: 'material',
  uiSupport: ['material'],
  uiResources: [],
  widgetMap: [
    { componentFqn: 'reactory-core.ReactoryOrganizationSelector@1.0.0', widget: 'OrganizationSelector' },
    { componentFqn: 'reactory-core.ReactoryClientSelector@1.0.0', widget: 'ClientSelector' },
    { componentFqn: 'reactory-core.ReactoryBusinessUnitSelector@1.0.0', widget: 'BusinessUnitSelector' },
  ],
  registerAsComponent: true,
  schema: $schema,
  uiSchema: $uiSchema,
  graphql: $graphql,
  queryStringMap: {}
};

// const EmailTemplateEditor =  {
//   components: [];

//   constructor(props) {
//     super(props)
//     this.state = {
//       loaded: false
//     }

//     const { reactory } = props;

//     this.components = reactory.getComponents(dependencies);
//     this.mutateComplete = this.mutateComplete.bind(this);
//     this.queryComplete = this.queryComplete.bind(this);
//   }

//   queryComplete({ formData, formContext, result, errors }) {
//     const { api } = this.props;
//     api.log('Email Template Editor Query Complete', { formData, formContext, result, errors }, 'debug');        
//   }

//   mutateComplete(formData, formContext, result) {
//     const { api } = this.props;
//     api.log('Email Template Editor Mutation Complete', { formData, formContext, result }, 'debug');

//     api.createNotification(`Template ${formData.name} saved. ✅`, { type: 'success', showInAppNotification: true, canDismiss: true, timeout: 2500 });
//   }


//   render() {
//     try {

//       const { api,
//         formDef = {},
//         view = 'reactory-core.WelcomeEmailTemplate@1.0.0',
//       } = this.props;

//       const { Material } = this.components;
//       const { MaterialCore, MaterialStyles } = Material;
//       const { Grid, Icon, TextField } = MaterialCore;

//       const composedForm = { ...ReactoryEmailTemplateEditor, ...formDef };
//       const ReactoryForm: React.FunctionComponent = this.components.ReactoryForm as React.FunctionComponent
//       return (

//         <ReactoryForm
//           formDef={composedForm}
//           onMutateComplete={this.mutateComplete}
//           onQueryComplete={this.queryComplete}
//           formData={{ view }}
//           mode={'edit'} />
//       )
//     } catch (renderError) {

//       return <>💥{renderError.message}</>
//     }
//   }
// }

const EmailTemplateEditor = (props: IReactoryComponentProps) => {

  const { reactory } = props;
    
  return <>WORK IN PROGRESS</>
}


export default {
  nameSpace,
  name: 'EmailTemplateEditor',
  version: '1.0.0',
  component: EmailTemplateEditor,
};