/**
 * Responsible for indicating the status
 * of a file that is uploaded. Use case can be 
 * per single element, or list item.
 */

const UserFileImportStatus = (props) => {
  
  const { reactory, id, status, workload_id, organization_id, } = props;
  const { React, MaterialCore } = reactory.getComponents(['react.React', 'material-ui.MaterialCore']);
  const { useState, useEffect } = React;

  const [errors, setErrors] = useState([]);
  const [statusText, setStatusText] = useState(status);
  const [fileData, setFileData] = useState(null);

  const { Grid, Button, Typography, Toolbar } = MaterialCore;

  const getData = async () => {

    /**
     * The query below consitutes the full object for the file import
     */


    const query = `query ReactoryFileImportPackage($organization_id: String!, $workload_id: String, $file_ids: [String]){
  ReactoryFileImportPackage(organization_id: $organization_id, workload_id: $workload_id) {
    id
    status
    organization {
      id
      name
      logo
    }
    files(file_ids: $file_ids) {
      id
      file {
        id
        alias
        filename        
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
  }
}`;

    try {
      const variables = { workload_id, organization_id, file_ids: [id] };

      const { data, errors = [] } = await reactory.graphqlQuery(query, variables).then();

      if (errors.length > 0) {
        setErrors(errors)
      }

      if (data && data.ReactoryFileImportPackage) {
        setFileData(data.ReactoryFileImportPackage.files[0]);
      }
    } catch (graphqlError) {
      reactory.log(`🚨 Error in GraphQL UserFileImportStatus`, { graphqlError }, 'error');
      setErrors([graphqlError]);
    }
  };


  useEffect(() => {
    getData();
  }, [])


  if (errors.length > 0) {
    return (<Typography>🚨 Error Getting Status</Typography>);
  }

  if (!fileData) return '🕘'

  const startImport = () => {
    reactory.graphqlMutation(`mutation StartProcessForPackage($workload_id: String!, $processors: [String], $file_ids: [String]){
      StartProcessForPackage(workload_id: $workload_id, processors: $processors, file_ids: $file_ids) {
        success
        message
      }
    }`, {
      workload_id,
      processors: ['core.UserFileImportProcessGeneral@1.0.0', 'core.UserFileImportProcessDemographics@1.0.0'],
      file_ids: [id]
    }).then(({ errors = [], data }) => {
      if (errors && errors.length > 0) {
        reactory.createNotification(`Could not start process for ${fileData.file.filename}`, { type: 'warning', showInAppNotification: true });
      }

      if (data && data.StartProcessForPackage) {
        const { success, message } = data.StartProcessForPackage;
        reactory.createNotification(message, { type: success === true ? 'success' : 'warning', showInAppNotification: true });
      }

    }).catch((error) => {
      setErrors([error])
    });
  }

  let actions = [];
  actions.push((<Button key={'options'} color="primary">Options</Button>))
  actions.push((<Button key={'preview'} color="primary">Preview</Button>))
  actions.push((<Button key={'import'} color="primary" onClick={startImport}>Import</Button>))
  actions.push((<Button key={'import'} style={{ color: reactory.muiTheme.palette.warning.main }}>Delete</Button>))


  const rp = {
    item: true, xs: 12, sm: 12, md: 6, lg: 6, xl: 6
  }

  return (
    <Grid container>
      <Grid {...rp}>
        <Typography>
          {fileData ? fileData.status : '🕘'}
        </Typography>
      </Grid>
      <Grid {...rp}>
        <Toolbar>
          {actions}
        </Toolbar>
      </Grid>
    </Grid>
  )
};

export default {
  name: 'UserFileImportStatus',
  nameSpace: 'core',
  version: '1.0.0',
  componentType: 'component',
  roles: ['ADMIN', 'DEVELOPER'],
  component: UserFileImportStatus
};