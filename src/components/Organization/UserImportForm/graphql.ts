const graphql: any = {
  query: {
    name: 'ReactoryFileImportPackage',
    text: `query ReactoryFileImportPackage($organization_id: String, $workload_id: String){
      ReactoryFileImportPackage(organization_id: $organization_id, workload_id: $workload_id) {
        id
        status
        organization {
          id
          name
          logo
        }
        processors {
          id
          name
          serviceFqn
          started
          finished
          fields
          responses {
            timestamp
            line
            error
          }
        }
        files {
          id
          file {
            id
            hash
            alias
            filename
            size
          }
          status
          fields
          processors {
            id
            name
            order
            serviceFqn
            started
            finished
            responses {
              timestamp
              line
              error
            }
          }
        }
        options {
          delimeter
          textQualifier
          firstRow
          columnMappings {
            sourceIndex
            fieldName
          }
        }
      }
    }`,
    variables: {
      'formData.organization_id': 'organization_id',
      'formData.id': 'workload_id'
    },
    resultMap: {
      'id': 'id',
      'organization': 'organization',
      'options': 'options',
      'files[].id': 'sources.files[].id',
      'files[].file.filename': 'sources.files[].filename',
      'files[].status': 'sources.files[].status',
      'status': 'status',
    },
    resultType: 'object'
  },
  mutation: {
    edit: {
      name: 'SetReactoryFileImportPackageStatus',
      text: `mutation SetUserImportFileUpload($workload_id: String, $status: String!) {
                id
                files {
                  id
                  filename
                  link
                  size
                  status
                }
                status
              }`,
      variables: {
        'formData.id': 'workload_id',
        'formData.status': 'status',
      },
      formData: {
        status: 'submit',
      },
      resultMap: {
        'id': 'id',
        'files': 'files',
        'status': 'status'
      },
    }
  }
}
export default graphql;