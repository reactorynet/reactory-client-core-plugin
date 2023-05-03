import { ReactoryClientCore } from "types";
import { 
  CoreOrganisationWithId,
  
} from "../graph/queries"
type OrganizationQueryResult {
  CoreOrganisationWithId: ReactoryClientCore.Models.IOranization;
}

export const useOrganization: ReactoryClientCore.Hooks.OrganizationHook = 
(props): ReactoryClientCore.Hooks.OrganizationHookReturn => {
  const { reactory, organizationId } = props;

  const { React } = reactory.getComponents<{ React: Reactory.React }>(["react.React"]);
  const {
    useState,
    useEffect,
    useCallback
  } = React;

  const [organization, setOrganization] = useState<ReactoryClientCore.Models.IOranization>(null);
  const [dirty, setIsDirty] = useState<boolean>(false);
  const [deleted, setIsDeleted] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const updateOrganisation = (next: ReactoryClientCore.Models.IOranization) => {
    if(reactory.utils.deepEquals(next, organization)) return;
    setIsDirty(true);
    setOrganization(next);
  }

  const saveOrganisation = useCallback(async (): Promise<void> => {
    setLoading(true);
    const { data, errors } = await reactory.graphqlMutation<
      OrganizationQueryResult, 
      { id: string, organization: ReactoryClientCore.Models.IOranization 
    }>(
      CoreOrganisationWithId, 
      { 
        id: organizationId,
        organization: organization
      });
    setLoading(false);
    if(errors && errors.length > 0) {
      const errorString: string = errors.map(e => e.message).join('\n');
      setError(errorString);
      return;
    }

    if(!data.CoreOrganisationWithId) {
      setError(`No organization found for id ${organizationId}`);        
      return;
    }

    setOrganization(data.CoreOrganisationWithId);
  }, [organization])

  const deleteOrganisation = async (next: ReactoryClientCore.Models.IOranization): Promise<void> => {

  }

  const load = useCallback(
    async () => {
      setLoading(true);
      const { data, error, errors } = await reactory.graphqlQuery<OrganizationQueryResult, { id: string }>(CoreOrganisationWithId, { id: organizationId });
      setLoading(false);
      if(error || errors) {
        const errorString: string = error ? error.message : errors.map(e => e.message).join('\n');
        setError(errorString);
        return;
      }

      if(!data.CoreOrganisationWithId) {
        setError(`No organization found for id ${organizationId}`);        
        return;
      }

      setOrganization(data.CoreOrganisationWithId);
    },
    [reactory, organizationId],
  );

  useEffect(() => {
    load();
  }, [load, organizationId]);

  

  return {
    organisation: organization,
    loading,
    error,
    update: updateOrganisation,
    save: saveOrganisation,
    delete: deleteOrganisation,
  }

}

const useOrganizationReactoryRegistration: Reactory.Client.IReactoryComponentRegistryEntry<ReactoryClientCore.Hooks.OrganizationHook> = {
  name: 'useOrganization',
  namespace: 'core',
  type: 'hook',
  version: '1.0.0',
  component: useOrganization,
  description: 'A hook to manage organization state',
  tags: ['hook', 'organization', 'state'],
};
