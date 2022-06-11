import Queries from './queries';
import Models from './models';
const {
  LoggedInOrganisationQuery,
  CoreOrganizations,
  SetActiveOrganisationMutation,
} = Queries;

export default (props) => {
  const {
    reactory,
    onOrganizationChanged,
    variant = 'avatar,label,default,toggle,new',    
    show_selector = false,
  } = props;

  const { React, ReactRouter, MaterialCore, MaterialStyles, AlertDialog } =
    reactory.getComponents([
      'react-router.ReactRouter',
      'react.React',
      'material-ui.MaterialCore',
      'material-ui.MaterialStyles',
      'core.AlertDialog',
    ]);

  const { useState, useEffect } = React;
  const { useParams } = ReactRouter;
  const { organization_id = 'default' } = ReactRouter.useParams();
  const {
    Avatar,
    Typography,
    Button,
    IconButton,
    Icon,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListSubheader,
    Tooltip,
  } = MaterialCore;
  const { makeStyles } = MaterialStyles;
  const { uniq, sortedUniqBy, filter } = reactory.utils.lodash;

  const [showOrganisationSelector, setShowOrganisationSelector] = useState(show_selector);
  const [version, setVersion] = useState(0);
  const [loaded, setIsLoaded] = useState(false);
  const [organisation, setOrganisation] = useState(Models.LoadingOrganisation);
  const [organisations, setOrganisations] = useState([Models.LoadingOrganisation]);
  const [unloading, setIsUnloading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [provider] = useState(new Models.CoreOrganizationList({
    reactory,
    active_organization_id: organization_id,
    onLoadComplete: (organisation, organisations) => {
      if (loaded === false) {
        if (unloading === false) {
          setIsLoaded(true);
          setOrganisation(organisation);
          setOrganisations(organisations);
        }
      }
    }
  }));

  useEffect(() => {
    if (unloading === false) {
      provider.setActiveOrganisation(organization_id)
      setVersion(version + 1)
    }
  }, [organization_id]);

  useEffect(() => {

    return () => {
      setIsUnloading(true);
    };
  }, [])

  useEffect(() => {    
    if(onOrganizationChanged && organisation) {
      onOrganizationChanged(organisation);
    }
  }, [organisation])

  const classes = makeStyles((theme) => {
    return {
      logged_in_organisation: {
        display: 'flex',
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
      sortedUniqBy(provider.organisations, (org) =>
        org.name.substring(0, 1).toUpperCase()
      ).map((org) => org.name.substring(0, 1).toUpperCase())
    );

    const grouped_items = availableAlphabet.map((letter, index) => {
      return (
        <li
          key={letter}
          className={
            classes && classes.userListSubheader
              ? classes.userListSubheader
              : ''
          }>
          <ul>
            <ListSubheader>{letter}</ListSubheader>
            {filter(
              provider.organisations,
              (org) => org.name.substring(0, 1).toUpperCase() === letter
            ).map((org, org_id) => {
              const onOrganisationSelected = () => {
                //setOrganisation(org);
                provider.setActiveOrganisation(org);
                setShowOrganisationSelector(false);
                if (onOrganizationChanged) onOrganizationChanged(org);
              };

              return (
                <ListItem
                  selected={provider.organisation.id === org.id}
                  onClick={onOrganisationSelected}
                  dense
                  button
                  key={org_id}>
                  <Avatar
                    variant='square'
                    alt={org.name}
                    src={org.avatarURL || org.logoURL}
                    onClick={onOrganisationSelected}>
                    {org.name.substring(0, 1)}
                  </Avatar>
                  <ListItemText inset primary={org.name} />
                </ListItem>
              );
            })}
          </ul>
        </li>
      );
    });

    return (
      <AlertDialog
        open={showOrganisationSelector === true}
        title={`Select Active Organisation`}
        content={`Click anywhere outside the window to close / cancel the selection`}
        onAccept={() => { }}
        onClose={() => setShowOrganisationSelector(false)}
        cancelTitle='Close'
        showAccept={false}
        cancelProps={{ variant: 'text', color: '#00b100' }}
        confirmProps={{ variant: 'text', color: '#F50000' }}>
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

  //const LoggedInOrganisationButton = () => {

  const has_multiple = organisations.length > 1;

  const onOrganisationSelectorClick = () => {
    setShowOrganisationSelector(!showOrganisationSelector);
  };

  const onFavoriteOrganisation = () => {
    if (provider.default_organisation_id !== provider.organisation.id)
      provider.default_organisation_id = provider.organisation.id;
    else provider.default_organisation_id = null;

    provider.__v += 1;
    provider.persist();
  };

  const onNewOrganization = () => {

  }

  const tooltip_title =
    provider.organisation.id === provider.default_organisation_id
      ? `Click to unset ${provider.organisation.name} as your default organisation`
      : `Click to make ${provider.organisation.name} your default organisation`;

  const display_avatar = variant.indexOf('avatar') >= 0;
  const display_label = variant.indexOf('label') >= 0;
  const display_toggle = variant.indexOf('toggle') >= 0;
  const display_default = variant.indexOf('default') >= 0;
  const display_new = variant.indexOf('new');

  const display_selectOrgButton =
    variant.indexOf('selectOrganisationButton') >= 0;
  
  return (
    <div className={classes.logged_in_organisation}>
      {display_selectOrgButton && (<Button onClick={onOrganisationSelectorClick} variant='outlined' color='primary'>Select Organisation</Button>)}
      {display_avatar && <Avatar variant="square" className={classes.organisation_avatar} src={provider.organisation.avatarURL || provider.organisation.logoURL}>{provider.organisation.name ? provider.organisation.name.substring(0, 1) : 'L'}</Avatar>}
      {display_label && <Typography className={classes.organisation_name}>{provider.organisation.name ? provider.organisation.name : 'Loading'}</Typography>}
      {display_default && has_multiple === true ? <Tooltip title={tooltip_title}><Icon onClick={onFavoriteOrganisation} className={`${classes.favorite_icon} ${provider.organisation.id === provider.default_organisation_id ? classes.favorite_selected : ''}`}>verified</Icon></Tooltip> : null}
      {display_toggle && has_multiple === true && onOrganizationChanged ? <IconButton onClick={onOrganisationSelectorClick}><Icon>more_vert</Icon></IconButton> : null}
      {display_new && <IconButton onClick={onNewOrganization}><Icon>add</Icon></IconButton>}
      <SelectOrganisationDialog />
    </div>
  );
};
