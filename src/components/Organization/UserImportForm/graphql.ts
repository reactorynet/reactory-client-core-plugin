const graphql: any = {
  query: {
    name: 'UserImportFileUpload',
    text: `query UserFileImportStatus($organization_id: String, $workload_id: String) {
        id
        organization {
          id
          name
        }
        options {
          delimeter
          textQualifier
          firstRow
        }
        files {
          id
          filename
          link
          size
        }
        status
      }`,
    variables: {
      'formContext.organization.id': 'organization_id',
      'formData.id': 'workload_id'
    },
    resultMap: {
      'id': 'id',
      'organization': 'organization',
      'options': 'options',
      'files': 'files',
      'status': 'status'
    },
  },
  mutation: {
    edit: {
      name: 'SetUserImportFileUpload',
      text: `mutation SetUserImportFileUpload($workload_id: String, $status: String) {
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
        'formContext.organization.id': 'organization_id',
        'formData.id': 'workload_id'
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