const uiSchema: any = {
  'ui:options': {
    submitIcon: 'task_alt',
    showSubmit: true,
    showHelp: true,
    showRefresh: false,
  },
  'ui:field': 'TabbedLayout',
  'ui:tab-layout': [
    { field: 'sources' },
    { field: 'options' },
  ],

  options: {
    'ui:field': 'GridLayout',
    'ui:grid-options': {
      container: 'div',
    },
    'ui:grid-layout': [
      // { importer: { sm: 12, md: 12, lg: 12 } },
      { delimeter: { xs: 12, sm: 6, md: 4, lg: 4 } },
      { textQualifier: { xs: 12, sm: 6, md: 4, lg: 4 } },
      { firstRow: { xs: 12, sm: 12, md: 4, lg: 4 } },
    ],
  },

  sources: {
    'ui:field': 'GridLayout',
    'ui:grid-options': {
      //container: 'div',
    },
    'ui:grid-layout': [
      { upload: { sm: 12, md: 12, lg: 12 } },
      { files: { sm: 12, md: 12, lg: 12 } }
    ],
    upload: {
      'ui:widget': 'ReactoryDropZoneWidget',
      'ui:options': {
        style: {

        },
        ReactoryDropZoneProps: {
          text: `Drop file here, or click to select file to upload`,
          accept: ['text/html', 'text/text', 'application/xml', 'application/pdf'],
          uploadOnDrop: true,
          mutation: {
            name: 'AddFileToImportPackage',
            text: `mutation AddFileToImportPackage($file: Upload!, $workload_id: String!){
              AddFileToImportPackage(file: $file, workload_id: $workload_id) {
                id
                file {
                  id
                  filename
                  link
                  size
                }
                status
                preview {
                  id
                  firstName
                  lastName
                  email
                  dob
                  gender
                  race
                  position
                  region
                  legalEntity
                  businessUnit
                  team
                }
                processors {
                  id
                  name
                  order
                  started
                  finished
                }
              }
            }`,
            variables: {
              'file': 'file',
              'workload_id': '${props.formContext.$formData.id}',
            },
            onSuccessEvent: {
              name: 'onFileAddedToImportPackage',
            }
          },
          iconProps: {
            icon: 'upload',
            color: 'secondary'
          },
          labelProps: {
            style: {
              display: 'block',
              paddingTop: '95px',
              height: '200px',
              textAlign: 'center',
            }
          },
          style: {
            minHeight: `200px`,
            outline: '1px dashed #E8E8E8'
          }
        },
      }
    },
    files: {
      'ui:widget': 'MaterialTableWidget',
      'ui:options': {
        columns: [
          {
            title: 'Filename',
            field: 'filename',
          },
          {
            title: 'Status',
            field: 'status',
          },
        ],
        options: {
          grouping: false,
          search: false,
          showTitle: false,
          toolbar: false,
        },
        componentMap: {
          DetailsPanel: 'core.UserFileImportStatus@1.0.0'
        },
        detailPanelPropsMap: {
          'formContext.$formData.id': 'workload_id',
          'formContext.$formData.organization.id': 'organization_id'
        }
      },
    }
  },
};

export default uiSchema;