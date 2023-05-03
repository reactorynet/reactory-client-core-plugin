import { useState, useEffect, useCallback } from 'react';
import OrganizationQueries from '../graph/queries'; // Assuming queries are exported from a 'queries' module
import { ReactoryClientCore } from 'types';

const LOCAL_STORAGE_KEY = 'CoreOrganisationList';

/**
 * useOrganizationList hook provides a list of organizations and the active organization
 * @param props 
 * @returns 
 */
export const useOrganizationList: ReactoryClientCore.Hooks.OrganizationListHook = 
  (props: ReactoryClientCore.Hooks.OrganizationListHookProps): ReactoryClientCore.Hooks.OrganizationListHookReturn => {
  
  const [organizations, setOrganisations] = useState<ReactoryClientCore.Models.OrganizationList>([]);
  const [error, setError] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { reactory  } = props;

  const load = useCallback(async () => {
    const { 
      data,
      errors,
      error,
    } = await reactory.graphqlQuery<{ CoreOrganizations: ReactoryClientCore.Models.OrganizationList }, {}>(OrganizationQueries.CoreOrganizations,{});

    if(error || errors) {
      const errorString: string = error ? error.message : errors.map(e => e.message).join('\n');
      setError(errorString);
      setLoading(false);
      return;
    }

    setOrganisations(data.CoreOrganizations);
    setLoading(false);
  }, [reactory]);

  useEffect(() => {
    load();
  }, []);

  return {
    organizations,   
    error,
    loading,    
  };
}