
const base_query = `
    id
    name
    avatarURL
    avatar
    logoURL
    logo
    settings
`;

const LoggedInOrganisationQuery = `
query CoreActiveOrganisation {
  CoreActiveOrganisation {
    ${base_query}
  }
}
`;

const CoreOrganizations = `
query CoreOrganizations  {
  CoreOrganizations {
    ${base_query}
  }
}  
`;

const SetActiveOrganisationMutation = `
mutation CoreSetActiveOrganisation($id: String!) {
  CoreSetActiveOrganisation(id: $id) {
    ${base_query}
  }
}
`;

const CoreSetOrganisationInfo = `
  mutation CoreSetOrganisationInfo($organisation: CoreOrganisationInput!) {
    CoreSetOrganisationInfo(organisation: $organisation){
      success
      message
      organisation {
        ${base_query}
      }
    }
  }
`;


export default {
  LoggedInOrganisationQuery,
  CoreOrganizations,
  SetActiveOrganisationMutation,
  CoreSetOrganisationInfo: CoreSetOrganisationInfo
};