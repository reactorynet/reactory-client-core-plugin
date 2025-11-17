'use strict'
import MoresMyPersonalDemographics from "../Forms/MyPersonalDemographics";
import schema from "../Forms/MyPersonalDemographics//schema";

import $uiSchema, {
  ageUISchema,
  raceUISchema,
  genderUISchema,
  pronounUISchema,
  positionUISchema,
  businessUnitUISchema,
  operationalGroupUISchema,
  teamUISchema,
  regionUISchema,
  dateOfBirthUISchema
} from "../Forms/MyPersonalDemographics/uiSchema";

const Demographics = (props: any) => {

  const { reactory, organisationId, user, membership } = props;
  const { id, memberships = [] } = user
  const { ReactoryForm, MaterialCore, React } = reactory.getComponents([
    "react.React",
    "core.ReactoryForm",
    "material-ui.MaterialCore"
  ]);
  const { Button, Typography, useTheme } = MaterialCore
  
  // MUI v6: Use theme hook and sx prop instead of makeStyles
  const theme = useTheme();
  
  const styles = {
    button_container: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingBottom: '26px',
      marginTop: '20px',
      marginRight: '26px',
      '& button': {
        padding: '10px 30px',
      },
    }
  }

  const [demographicsEnabled, setDemographicState] = React.useState({
    age: false,
    gender: false,
    race: false,
    position: false,
    region: false,
    operationalGroup: false,
    businessUnit: false,
    teams: false,
  });

  /**
   * 
   * @param formSubmit - contains { formData, formContext, schema, uiSchema and Error Schema }
   */
  const updateDemographic = ({ formData }) => {
    const _membershipId = membership ? membership.id : ''
    const input = {
      userId: id,
      organisationId: organisationId,
      membershipId: _membershipId,

      dob: formData.dateOfBirth,
      gender: formData.gender,
      race: formData.race,
      position: formData.position,
      region: formData.region,
      operationalGroup: formData.operationalGroup,
      team: formData.teams,
      businessUnit: formData.businessUnit
    }
    // for (const [key, value] of Object.entries(formData)) {
    //   if (value) input[key] = value
    // }
    reactory.graphqlMutation(`
      mutation MoresUpdateUserDemographic($input: UserDemographicInput!){
        MoresUpdateUserDemographic(input:$input){
          id
          gender{
            id
            key
            title
          }
          dateOfBirth
          age
          ageGroup {
            id
            title
            key
          }
          race{
            id
            key
            title
          }
          position{
            id
            key
            title
          }
          region{
            id
            key
            title
          }
          operationalGroup{
            id
            key
            title
          }
          businessUnit{
            id
            name
          }
          team{
            id
            name
          }
        }
      }`, { input }).then(({ data, errors = [] }) => {
      if (errors.length > 0) {
        reactory.createNotification('Mutation indicates errors occured, check logs for details', { type: 'warning' });
        reactory.log('Errors in mutation result', { errors, data }, 'error');
      } else {
        if(formRef && formRef.current) formRef.current.refresh();
        reactory.createNotification("Demographics has been updated", { type: "success" })
      }
    }).catch((err) => {
      reactory.createNotification('Network or related API error occured, please check logs', { type: 'warning' });
      reactory.log('Errors in API call', { err }, 'error');
    });
  }

  const [demographicsAvail, setDemographicsAvail] = React.useState(false)
  const formRef = React.useRef(null)
  const _schema = {
    type: 'object',
    properties: {
      id: {
        type: "string",
        title: "Client Id",
      },
    },
  };
  const _uiSchema = {}
  const getDemographicsEnabled = () => {

    if (!organisationId || organisationId === '') return;

    reactory.graphqlQuery(
      `query ReactoryGetOrgnizationDemographicsSetting($id: String!){
      ReactoryGetOrganizationDemographicsSetting(id: $id) {
        age
        gender
        race
        position
        region
        operationalGroup
        businessUnit
        teams
      }
    }`,
      { id: organisationId },
      { fetchPolicy: "network-only" }
    )
      .then(({ data, errors = [] }) => {
        if (errors.length > 0) {
          reactory.createNotification(
            "Could not retrieve the demographics settings for the organizaion",
            { type: "warning" }
          );
          reactory.log(
            "ReactoryGetOrganizationDemographicsSetting returned errors",
            { errors },
            "error"
          );
        }

        if (data && data.MoresGetOrganizationDemographicsSetting) {
          setDemographicState({
            ...demographicsEnabled,
            ...data.MoresGetOrganizationDemographicsSetting,
          });
          setDemographicsAvail(true)
        }

      })
      .catch((error) => {
        reactory.log(
          "ReactoryGetOrganizationDemographicsSetting returned errors",
          { error },
          "error"
        );
        reactory.createNotification(
          "Could not retrieve the demographics settings for the organizaion",
          { type: "error" }
        );
      });
  };
  Object.keys(demographicsEnabled).map((key) => {
    const field = schema[key];

    if (demographicsEnabled[key]) {
      if(key === "age" ) {
        _schema.properties[`dateOfBirth`] = schema.dateOfBirth;
      }
      _schema.properties[`${key}`] = { ...field };
      return _schema;
    }
  });
  React.useEffect(() => {
    getDemographicsEnabled();
  }, [organisationId, membership]);

  const formDef = {
    ...MoresMyPersonalDemographics,
    schema: { ..._schema },
    uiSchema: {
      ...$uiSchema,
      age: { ...ageUISchema },
      dateOfBirth: { ...dateOfBirthUISchema },      
      race: { ...raceUISchema },
      gender: { ...genderUISchema },
      position: { ...positionUISchema },
      pronoun: { ...pronounUISchema },
      region: { ...regionUISchema },
      operationalGroup: { ...operationalGroupUISchema },
      businessUnit: { ...businessUnitUISchema },
      teams: { ...teamUISchema },
    },
  };

  if (membership === null || membership === undefined) return (<Typography variant="body1">No membership available</Typography>)
  if (organisationId === null || organisationId === '' || organisationId === undefined) return (<Typography variant="body1">Demographic Selection Only Available within an organisation context</Typography>)
  if (demographicsAvail === false) return (<h1>Loading...</h1>)
  return (
    <React.Fragment>
      {props?.heading}
      <ReactoryForm
        formDef={formDef}
        organisationId={organisationId}
        userId={user.id}
        refCallback={(ref: any) => { formRef.current = ref }}
        onSubmit={updateDemographic}
      >
        <div style={styles.button_container}>
          <Button variant="contained" color="secondary" onClick={() => {
            if (formRef !== null && formRef !== undefined && formRef.current !== null && formRef.current !== undefined) {
              //@ts-ignore
              formRef.current.submit();
            }
          }}>
            Save Changes
          </Button>
        </div>
      </ReactoryForm>
    </React.Fragment>

  )
};
const DemographicsRegistry: Reactory.Client.IReactoryComponentRegistryEntry<typeof Demographics>  = {
  component: Demographics,
  name: 'UserDemographics',
  description: 'Demographics interface for users',
  nameSpace: 'core',
  version: '1.0.0',
  roles: ['USER'],
  title: 'Demographics',
  tags: ['Demographics', 'User', 'Profile', 'Settings'],
};

export default DemographicsRegistry;
