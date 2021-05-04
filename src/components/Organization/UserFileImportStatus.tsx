/**
 * Responsible for indicating the status
 * of a file that is uploaded. Use case can be 
 * per single element, or list item.
 */

const UserFileImportStatus = ({ reactory, file_id, use_case = 'grid' }) => {
  const { React, MaterialCore } = reactory.getComponents(['react.React', 'material-ui.MaterialCore']);
  const { useState, useEffect } = React;

  const [errors, setErrors] = useState(null);
  const [fileData, setFileData] = useState(null);

  const getData = async () => {

    /**
     * The query below consitutes the full object for the file import
     */

    const query = `query UserFileImportStatus($workload_id: String){
      UserFileImportStatus(workload_id: $workload_id) {
        id
        organization {
          id
          name
        }
        options {
          delimeter
          textQualifier
          headers
        }
        files {
          id
          filename
          link
          size
        }
        status
        processors {
          name
          order
          isDone
          started
          finished
          responses {
            line
            error
          }
        }
        preview {
          id
          firstName
          lastName
          dob
          gender
          race
          region
          legalEntity
          businessUnit
          team
          position
        }
        completed
        rows
        started
        finished
        response {
          id
          filename
          link
          size
        }
      }
    }`;

    try {
      const { data, errors = [] } = await reactory.graphqlQuery(query, { id: file_id }).then();

      if (errors.length > 0) {
        setErrors(errors)
      }

      if (data && data.UserFileImportStatus) {
        setFileData(data.UserFileImportStatus);
      }
    } catch (graphqlError) {
      reactory.log(`Error in GraphQL`, { graphqlError }, 'debug');
      setErrors([graphqlError])
    }
  };


  useEffect(() => {
    getData();
  }, [])


  switch (use_case) {
    case 'grid':
    default: {
      if (errors.length > 0) {
        return (<MaterialCore.Typography>🚨 Error Getting Status</MaterialCore.Typography>);
      }
      return (<MaterialCore.Typography>{fileData !== null ? fileData.status : '🕘'}</MaterialCore.Typography>)
    }
  }
};

export default {
  name: 'UserFileImportStatus',
  nameSpace: 'core',
  version: '1.0.0',
  type: 'component',
  roles: ['ADMIN', 'DEVELOPER'],
  component: UserFileImportStatus
};