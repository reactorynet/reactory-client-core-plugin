const schema: any = {
  type: 'object',
  title: 'Configure Import Package',
  properties: {
    id: {
      type: 'string',
      title: 'Workload Id',
      description: 'The workload id generated by the system',
    },
    sources: {
      type: 'object',
      title: 'File Sources',
      properties: {
        upload: {
          type: 'string',
          title: 'Add files to process'
        },
        files: {
          type: 'array',
          title: 'Files to process',
          items: {
            type: 'object',
            properties: {
              id: {
                title: 'File Id',
                type: 'string'
              },
              filename: {
                type: 'string',
                title: 'Filename'
              },
              status: {
                type: 'string',
                title: 'File Status',
              },
              response: {
                type: 'string',
                title: 'Response file for download'
              },
              preview: {
                type: 'array',
                title: 'Preview Data',
                items: {
                  type: 'object',
                  properties: {
                    row_id: {
                      type: 'number',
                      title: 'Row#'
                    },
                    id: {
                      type: 'string',
                      title: 'User Id'
                    },
                    firstName: {
                      type: 'string',
                      title: 'First name',
                    },
                    lastName: {
                      type: 'string',
                      title: 'Last name'
                    },
                    emailAddress: {
                      type: 'string',
                      title: 'Email Address'
                    },
                    dob: {
                      type: 'string',
                      title: 'Date of Birth',
                    },
                    gender: {
                      type: 'string',
                      title: 'Gender',
                    },
                    race: {
                      type: 'string',
                      title: 'Race',
                    },
                    region: {
                      type: 'string',
                      title: 'Region',
                    },
                    legalEntity: {
                      type: 'string',
                      title: 'Legal Entity',
                    },
                    businessUnit: {
                      type: 'string',
                      title: 'Business Unit',
                    },
                    team: {
                      type: 'string',
                      title: 'Team'
                    },
                    Position: {
                      type: 'string',
                      title: 'Position'
                    },
                    roles: {
                      type: 'array',
                      title: 'Roles',
                      items: {
                        type: 'string',
                        title: 'Role'
                      }
                    },
                    status: {
                      type: 'string',
                      title: 'User status'
                    }
                  }
                }
              },
            },
          }
        },
      }
    },
    options: {
      type: 'object',
      title: 'Import Options',
      description: 'Use this section to define the import settings for this workload.',
      required: ['delimeter', 'firstRow'],
      properties: {
        importer: {
          type: 'string',
          title: 'Import Workflow Package',
          default: 'core.UserFileImportWorkflow@1.0.0'
        },
        delimeter: {
          type: 'string',
          title: 'Delimeter',
          default: ','
        },
        firstRow: {
          type: 'string',
          title: 'First Row',
          enum: ['skip', 'headers', 'data'],
          default: 'headers',
        },
        textQualifier: {
          type: 'string',
          title: 'Text Qualifier',
          default: ''
        },
      }
    },
    organization: {
      type: 'object',
      properties: {
        id: { type: 'string', title: 'id' },
        name: { type: 'string', title: 'Organization name' },
        logo: { type: 'string', title: 'Logo' },
      },
    },
  }
};

export default schema;