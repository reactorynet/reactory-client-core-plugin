
const UserImportButton = (props: any) => {

  const { reactory, organization } = props;


  if (!organization) {
    throw new Error('Component Requires Organization Id');
  }

  const {
    React,
    MaterialCore,
    FullScreenModal,
    UserImportForm
  } = reactory.getComponents(['react.React', 'material-ui.MaterialCore', 'core.FullScreenModal', 'core.UserImportForm']);

  const [showUploadForm, setShowUploadForm] = React.useState(false);

  const { Button, Icon } = MaterialCore;
  return (
    <>
      <Button onClick={() => { setShowUploadForm(true) }}><Icon>upload</Icon>Import Users</Button>
      <FullScreenModal open={showUploadForm === true}
        title='Upload'
        onClose={() => { setShowUploadForm(false) }}
      >
        <UserImportForm organization={organization} />
      </FullScreenModal>
    </>
  )
}

export default {
  nameSpace: 'core',
  name: 'UserImportButton',
  component: UserImportButton,
  version: '1.0.0',
  componentType: 'component',
  roles: ['ADMIN', 'DEVELOPER']
}