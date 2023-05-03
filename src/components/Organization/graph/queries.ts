
const base_query = `
    id
    name
    avatarURL
    avatar
    logoURL
    logo
    settings
`;

export const LoggedInOrganisationQuery = `
query CoreActiveOrganisation {
  CoreActiveOrganisation {
    ${base_query}
  }
}
`;

export const CoreOrganizations = `
query CoreOrganizations  {
  CoreOrganizations {
    ${base_query}
  }
}  
`;

export const CoreOrganisationWithId = `
query CoreOrganisationWithId($id: String!) {
  CoreOrganisationWithId(id: $id) {
    ${base_query}
  }
}
`;

export const SetActiveOrganisationMutation = `
mutation CoreSetActiveOrganisation($id: String!) {
  CoreSetActiveOrganisation(id: $id) {
    ${base_query}
  }
}
`;

export const CoreSetOrganisationInfo = `
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
  CoreSetOrganisationInfo: CoreSetOrganisationInfo,
  CoreOrganisationWithId
};