
const UserImportButton = (props: any) => {

  const { reactory, organization } = props;


  if (!organization) {
    throw new Error('Component Requires Organization Id');
  }

  const {
    React,
    MaterialCore,
    FullScreenModal,
    UserImportForm,
    StaticContent
  } = reactory.getComponents(['react.React', 'material-ui.MaterialCore', 'core.FullScreenModal', 'core.UserImportForm', 'core.StaticContent']);

  const [showUploadForm, setShowUploadForm] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const { Button, Icon, Grid, Typography } = MaterialCore;

  const rowprops = {
    item: true,
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 12
  }

  const UserImportResults = () => {

    if (isProcessing === true) {
      return (
        <Typography variant={'body1'}>Your package is processing, for detailed results view individual file statuses.</Typography>
      )
    }

    return (
      <Typography variant={'body1'}>Upload your file(s) and then click start to submit the import for processing.</Typography>
    )
  }

  const onMutationComplete = () => {

  };

  return (
    <>
      <Button onClick={() => { setShowUploadForm(true) }}><Icon>upload</Icon>Import Users</Button>
      <FullScreenModal open={showUploadForm === true}
        title='Upload Users CSV'
        onClose={() => { setShowUploadForm(false) }}
      >
        <Grid container>
          <Grid {...rowprops}>
            <StaticContent slug='reactory-user-import-form' />
          </Grid>
          <Grid {...rowprops}>
            <UserImportForm organization={organization} onMutationComplete={onMutationComplete} />
          </Grid>
          <Grid>
            <UserImportResults />
          </Grid>
        </Grid>
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