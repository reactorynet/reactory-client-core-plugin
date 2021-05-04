const uiSchema: any = {
  'ui:options': {
    submitIcon: 'task_alt',
    showSubmit: true,
    showHelp: true,
    showRefresh: true,
  },
  'ui:field': 'TabbedLayout',
  'ui:tab-layout': [
    { field: 'options' },
    { field: 'sources' },
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
            name: 'UserFileImportUpload',
            text: `mutation UserFileImportUpload($file: Upload!, $options: $CSVImportOptionsInput, $uploadContext: String){
              UserFileImportUpload(file: $file, uploadContext: $uploadContext) {
                id
                file {
                  id
                  filename
                  link
                  size
                }
                status
              }
            }`,
            variables: {
              'uploadContext': 'core.UserFileImport'
            },
            onSuccessEvent: {
              name: 'onUserFileImported'
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
          {
            title: 'Response',
            field: 'response',
          }
        ],
        options: {
          grouping: false,
          search: false,
          showTitle: false,
          toolbar: false,
        },
        componentMap: {
          DetailsPanel: 'core.UserFileImportStatus'
        }
      },
    }
  },
};

export default uiSchema;