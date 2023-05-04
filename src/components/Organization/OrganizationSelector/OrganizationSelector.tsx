import Queries from '../graph/queries';
import Models, { CoreOrganisationModel, CoreOrganizationList } from '../models/models';
import { useOrganizationList, useOrganization } from '../hooks';

export type OrganizationSelectorProps = {
  reactory: Reactory.Client.IReactoryApi,
  onOrganizationChanged: (organization: CoreOrganisationModel) => void,
  variant?: string,
  show_selector?: boolean,
  routeParam?: string,
  organization_id?: string
}

export type CoreSetOranizationResult = Reactory.Models.IOrganization;

export default (props: OrganizationSelectorProps) => {
  const {
    reactory,
    onOrganizationChanged,
    variant = 'avatar,label,default,toggle,new',
    show_selector = false,
    routeParam = 'organization_id'
  } = props;

  const {
    i18n,
  } = reactory;
  const { React, ReactRouterDom, MaterialCore, MaterialStyles, AlertDialog } =
    reactory.getComponents<{ 
      React: Reactory.React, 
      ReactRouterDom: Reactory.Routing.ReactRouterDom,
      MaterialCore: Reactory.Client.Web.MaterialCore,
      MaterialStyles: Reactory.Client.Web.MaterialStyles,
      AlertDialog: React.FC<any>
     }>([
      'react-router.ReactRouterDom',
      'react.React',
      'material-ui.MaterialCore',
      'material-ui.MaterialStyles',
      'core.AlertDialog',
    ]);

  const { useState, useEffect, useRef } = React;
  const { useParams, useNavigate } = ReactRouterDom;
  const params = ReactRouterDom.useParams();
  const navigation = useNavigate();

  let organization_id = params[routeParam];
  
  if(props.organization_id && !organization_id) organization_id = props.organization_id;
  if(!organization_id) organization_id = 'default';

  const { 
    loading: loadingOrganizations, 
    organizations, 
    error: errorOrganizations,
    defaultOrganizationId,
  } = useOrganizationList({ reactory });

  const { 
    loading: loadingOrganization, 
    organization,
    setOrganization,
    create,
    update, 
    error: errorOrganization } = useOrganization({ reactory, organizationId: organization_id });

  const {
    Avatar,
    Typography,
    Button,
    IconButton,
    Icon,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    ListSubheader,
    Tooltip,
  } = MaterialCore;
  const { makeStyles } = MaterialStyles;
  const { uniq, sortedUniqBy, filter } = reactory.utils.lodash;

  const [showOrganisationSelector, setShowOrganisationSelector] = useState(show_selector);
  const [version, setVersion] = useState(0);
  const [unloading, setIsUnloading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showNewOrganizationDialog, setShowNewOrganizationDialog] = useState(false);
  const [newOrganizationName, setNewOrganizationName] = useState("");


  const classes = makeStyles((theme) => {
    return {
      logged_in_organisation: {
        display: 'flex',
        margin: '8px',
      },
      organisation_avatar: {
        color: theme.palette.primary.main,
        width: '54px',
        height: '54px',
      },
      organisation_name: {
        color: theme.palette.primary.main,
        font: 'Roboto',
        fontSize: '28px',
        fontWeight: 700,
        lineHeight: '40px',
        letterSpacing: '0.5px',
        textAlign: 'left',
        marginLeft: '8px',
        paddingTop: '8px',
      },
      organisation_list_item: {},
      favorite_icon: {
        cursor: 'pointer',
        color: 'rgba(0,0,0,0.3)',
      },
      favorite_selected: {
        color: theme.palette.secondary.main,
      },
    };
  })();

  const SelectOrganisationDialog = () => {
    const availableAlphabet = uniq(
      sortedUniqBy(organizations, (org) =>
        org.name.substring(0, 1).toUpperCase()
      ).map((org) => org.name.substring(0, 1).toUpperCase())
    );

    const grouped_items = availableAlphabet.map((letter, index) => {
      return (
        <li
          key={letter}>
          <ul>
            <ListSubheader>{letter}</ListSubheader>
            {filter(
              organizations,
              (org) => org.name.substring(0, 1).toUpperCase() === letter
            ).map((org, org_id) => {
              const onOrganisationSelected = () => {
                //setOrganisation(org);
                setShowOrganisationSelector(false);
                if (onOrganizationChanged) {
                  onOrganizationChanged(org);
                }
              };

              return (
                <ListItem
                  onClick={onOrganisationSelected}
                  dense
                  key={org_id}>
                  <ListItemButton
                    selected={organization?.id === org.id}>                    
                    <Avatar
                      variant='square'
                      alt={org.name}
                      src={org.avatarURL || org.logoURL}
                      onClick={onOrganisationSelected}>
                      {org.name.substring(0, 1)}
                    </Avatar>
                    <ListItemText inset primary={org.name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </ul>
        </li>
      );
    });

    if (showOrganisationSelector === false) return null;

    return (
      <AlertDialog
        open={showOrganisationSelector === true}
        title={`Select Active Organisation`}
        content={`Click anywhere outside the window to close / cancel the selection`}
        onAccept={() => { }}
        onClose={() => setShowOrganisationSelector(false)}
        cancelTitle='Close'
        showAccept={false}
        cancelProps={{}}>
        <Paper elevation={1} className={classes.image_container}>
          <List
            component='nav'
            className={classes.root}
            aria-label='contacts'
            subheader={<li />}>
            {grouped_items}
          </List>
        </Paper>
      </AlertDialog>
    );
  };

  const has_multiple = organizations.length > 1;

  const onOrganisationSelectorClick = () => {
    setShowOrganisationSelector(!showOrganisationSelector);
  };

  const onFavoriteOrganisation = () => {
    // if (provider.current.default_organisation_id !== provider.current.organisation.id)
    //   provider.current.default_organisation_id = provider.current.organisation.id;
    // else provider.current.default_organisation_id = null;

    // provider.current.__v += 1;
    // provider.current.persist();
  };

  const onNewOrganization = () => {
    setShowNewOrganizationDialog(true);
  }

  const tooltip_title = organization && organization?.id ? 
    (organization?.id === defaultOrganizationId
      ? `Click to unset ${organization?.name} as your default organisation`
      : `Click to make ${organization?.name} your default organisation`) : "";

  const display_avatar = variant.indexOf('avatar') >= 0;
  const display_label = variant.indexOf('label') >= 0;
  const display_toggle = variant.indexOf('toggle') >= 0;
  const display_default = variant.indexOf('default') >= 0;
  const display_new = variant.indexOf('new');

  const display_selectOrgButton =
    variant.indexOf('selectOrganisationButton') >= 0;

  const onNewOrganizationNameChange = (evt) => {
    if(organization === null || organization === undefined) {
      setOrganization({ name: evt.target.value, code: 'NOT-SET', logo: null });
    } else {
      setOrganization({...organization, name: evt.target.value });
    }
  }

  const NewOrganizationWidget = (<>
          <MaterialCore.TextField
            id="newOrganization"
            label="Organization Name"
            placeholder="eg: ACME CORP"
            value={organization?.name}
            fullWidth
            onChange={onNewOrganizationNameChange}
            style={{ margin: '1rem 0' }}
             />
          <Button onClick={create}>{i18n.t("reactory:reactory.organizations.create_new_cta", "CREATE ORGANIZATION").toUpperCase()}</Button> 
      </>)

  if(loadingOrganizations === true) {
    return <>...</>
  }

  if(errorOrganizations !== null && errorOrganizations !== undefined) {
    return <>Error loading organizations</>
  }

  if(organizations.length === 0) {
    return NewOrganizationWidget
  }

  return (
    <div className={classes.logged_in_organisation}>
      {display_selectOrgButton && (<Button onClick={onOrganisationSelectorClick} variant='outlined' color='primary'>Select Organisation</Button>)}
      {display_avatar && <Avatar variant="square" className={classes.organisation_avatar} src={organization?.avatarURL || organization?.logoURL}>{organization?.name ? organization?.name.substring(0, 1) : 'L'}</Avatar>}
      {display_label && <Typography className={classes.organisation_name}>{organization?.name ? organization?.name : 'Loading'}</Typography>}
      {display_default && has_multiple === true ? <Tooltip title={tooltip_title}><Icon onClick={onFavoriteOrganisation} className={`${classes.favorite_icon} ${organization?.id === defaultOrganizationId ? classes.favorite_selected : ''}`}>verified</Icon></Tooltip> : null}
      {display_toggle && has_multiple === true && onOrganizationChanged ? <IconButton onClick={onOrganisationSelectorClick}><Icon>more_vert</Icon></IconButton> : null}
      {display_new && <IconButton onClick={onNewOrganization}><Icon>add</Icon></IconButton>}
      <SelectOrganisationDialog />
    </div>
  );
};
