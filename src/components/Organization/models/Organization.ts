
const useOrganization = (props) => {

  const hydrate = useCallback(
    (active_organization_id) => {
      localForage.getItem(local_storage_key, (strdata) => {
        // ...rest of the code
      });
    },
    [local_storage_key],
  );

  const persist = useCallback(() => {
    // ...rest of the code
  }, [default_organisation_id, last_organisation_id, recent_organisations, top_organisations, organisation, organisations, active_organization_id]);

  const updateOrganisation = useCallback(
    (updated_organization) => {
      // ...rest of the code
    },
    [organisations],
  );

  const load = useCallback(
    async (organisation_id: string = 'default') => {
      // ...rest of the code
    },
    [reactory, organisation, organisations],
  );

  const setActiveOrganisation = useCallback(
    (organisation: string | CoreOrganisationModel) => {
      // ...rest of the code
    },
    [organisations],
  );

  const getActiveOrganisation = useCallback(async () => {
    // ...rest of the code
  }, [reactory]);

}