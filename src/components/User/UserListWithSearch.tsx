import Reactory from '@reactory/reactory-core';

type USER_FILTER = string | "search" | "business_unit" | "team" | "demographics";
type USERLIST_VIEWMODE = string | "list" | "grid" | "cards";
interface UserListWithSearchProps extends Reactory.IReactoryComponentProps {
  onAcceptSelection: (selection: Reactory.Models.IUser | Reactory.Models.IUser[]) => void,
  onUserSelect: (user: Reactory.Models.IUser) => void,
  organization_id: string,
  filters: USER_FILTER[],
  onNewUserClick: (evt: React.SyntheticEvent) => void,
  onDeleteUsersClick: (evt: React.SyntheticEvent) => void,
  allowDelete: boolean,
  excluded: Reactory.Models.IUser[],
  selected: Reactory.Models.IUser[],
  multiSelect: boolean,
  mode: USERLIST_VIEWMODE,
  reactory: Reactory.Client.IReactoryApi,
  page: number,
  pageSize: number,
  onPageChange: (page: number) => void,
  refreshEvents: string[],
  [key: string]: any
};

interface UserListSearchDependencies {
  React: Reactory.React,
  Material: Reactory.Client.Web.IMaterialModule
}


export const UserListWithSearch = (props: UserListWithSearchProps) => {

  const { reactory } = props;

  const { 
    React,
    Material
  } = reactory.getComponents<UserListSearchDependencies>(["react.React", "material-ui.Material"])

  const {
    MaterialCore,
    MaterialIcons,
  } = Material;

  const {
    AppBar,
    Badge,
    Button,
    Icon,
    IconButton,
    InputBase,
    Toolbar,
    Typography,
    Tooltip,
    alpha
  } = MaterialCore;

  const {
    Search
  } = MaterialIcons;

  const {
    onAcceptSelection = null, //empty handler,
    onNewUserClick = null, //empty handler
    onDeleteUsersClick = null,
    onUserSelect = null,
    organization_id,
    teams = [],
    filters = ["search"],
    allowDelete = false,
    multiSelect = true,
    selected = [],
    excluded = [],
    mode = 'list',
    page = 1,
    pageSize = 25,
    onSearch = null,
    refreshEvents = []
  } = props;

  // MUI v6: Use theme hook and sx prop instead of makeStyles
  const theme = MaterialCore.useTheme();
  
  const styles = {
    mainContainer: {
      padding: '5px',
      height: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: '#F3F2F1',
      overflow: 'hidden'
    },
    columnContainer: {
      width: '100%',
      overflowX: 'scroll',
      maxHeight: (window.innerHeight - 140),
      padding: theme.spacing(1),
      display: 'flex',
      justifyContent: 'center',
      minWidth: 250 * 5
    },
    general: {
      padding: '5px'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    userList: {
      maxHeight: (window.innerHeight - 140) / 2,
      overflow: 'scroll'
    },
    taskList: {

    },
    column: {
      maxHeight: (window.innerHeight - 140),
      overflowY: 'scroll',
      padding: theme.spacing(1),
      margin: theme.spacing(2),
      minWidth: '250px',
      maxWidth: '350px',
      width: (window.innerWidth / 5)
    },
    toolbar: {
      marginBottom: theme.spacing(2)
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(9),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(10),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    }
  };

  const { useState, useEffect } = React;

  const [searchString, setSearchString] = useState(props.searchString);
  const [inputText, setInputText] = useState(props.searchString);
  const [skip, setSkip] = useState(false);
  const [show_deleted, setShowDeleted] = useState('');
  const [business_units, setBusinessUnits] = useState([]);

  const [paging, setPaging] = useState({ page, pageSize });


  const { UserList } = reactory.getComponents(['core.UserList'])

  useEffect(() => {
    if (refreshEvents && refreshEvents.length > 0) {
      refreshEvents.forEach((evt) => {
        reactory.on(evt, doRefresh);
      });
    }

    return () => {
      if (refreshEvents && refreshEvents.length > 0) {
        refreshEvents.forEach((evt) => {
          reactory.removeListener(evt, doRefresh);
        });
      }
    }

  }, []);

  const doRefresh = () => {
    //this.setState({ skip: false, searchString: this.state.inputText });
    setSkip(false);
    setSearchString(inputText);
  }

  useEffect(() => {
    if (paging.page > 1) {
      setPaging({ page: 1, pageSize: paging.pageSize });
    }
  }, [searchString])

  const onSearchStringChanged = (evt) => {
    setInputText(evt.target.value);
  }

  const doSearch = () => {
    //this.setState({ searchString: this.state.inputText })
    setSearchString(inputText);
  };

  const onSearchStringOnKeyPress = (evt) => {
    if (evt.charCode === 13) doSearch();
  }


  const onShowBusinessUnitFilter = () => {

  }


  const onPageChange = (new_page) => {
    setPaging({ ...paging, page: new_page });
  }

  return (
    <>
      <AppBar position="sticky" color="default" sx={styles.toolbar}>
        <Toolbar>
          <Typography variant="h6" color="inherit">Employees</Typography>
          <MaterialCore.Box sx={styles.search}>
            <MaterialCore.Box sx={styles.searchIcon}>
              <Icon><Search /></Icon>
            </MaterialCore.Box>
            <InputBase
              placeholder="Search…"
              value={inputText}
              onChange={onSearchStringChanged}
              onKeyPress={onSearchStringOnKeyPress}
              sx={{
                ...styles.inputRoot,
                '& input': styles.inputInput,
              }}
            />
          </MaterialCore.Box>
          <Tooltip title={`Click to refresh after changing your search options`}>
            <IconButton color="primary" onClick={doRefresh}>
              <Badge badgeContent={skip ? '!' : ''} hidden={skip === false} color="secondary">
                <Icon>cached</Icon>
              </Badge>
            </IconButton>
          </Tooltip>

          {onNewUserClick && <Tooltip title={`Click to add new employee`}>
            <IconButton color="primary" onClick={onNewUserClick}>
              <Icon>add_circle_outline</Icon>
            </IconButton>
          </Tooltip>}

          {filters.indexOf("business_unit") >= 0 ? <Tooltip title={`Filter By Business Unit`}>
            <IconButton color="inherit" onClick={onShowBusinessUnitFilter}>
              <Icon>filter</Icon>
            </IconButton>
          </Tooltip> : null}

          {allowDelete === true && selected.length > 0 &&
            <Tooltip title={`Click here to delete the ${selected.length > 1 ? `${selected.length} employees` : 'employee'} selected`}>
              <IconButton color="inherit" onClick={onDeleteUsersClick}>
                <Icon>delete</Icon>
              </IconButton>
            </Tooltip>
          }
          {
            selected.length > 0 && <Tooltip title={`Click here to clear your selected`}>
              <IconButton color="primary" onClick={() => { if (props.onClearSelection) props.onClearSelection() }}>
                <Badge badgeContent={selected.length} hidden={skip === false} color="secondary">
                  <Icon>select_all</Icon>
                </Badge>
              </IconButton>
            </Tooltip>
          }
          {onAcceptSelection && selected.length > 0 && <Tooltip title={'Click to accept your selection'}>
            <Button
              onClick={() => { onAcceptSelection(selected) }}
              style={{ marginRight: "4px", marginLeft: '40px', color: '#ffffff', background: '#7d983c' }}
              variant="contained"
            >
              Confirm
            </Button>
          </Tooltip>}
        </Toolbar>

      </AppBar>

      <UserList
        onUserSelect={onUserSelect}
        organizationId={organization_id}
        searchString={searchString}
        skip={skip === true}
        selected={selected}
        excluded={excluded}
        multiSelect={multiSelect === true || false}
        page={paging.page || 1}
        pageSize={paging.pageSize || 25}
        onPageChange={onPageChange} />
    </>
  )
};

const UserListWithSearchRegistration: Reactory.IReactoryComponentDefinition<typeof UserListWithSearch> = {
  nameSpace: "core",
  name: "UserList",
  component: UserListWithSearch,
  version: "1.0.0",
  roles: ["USER"],
  tags: [],
  description: "A component that displays a list of users with a search bar and filters"  
};

export default UserListWithSearchRegistration;