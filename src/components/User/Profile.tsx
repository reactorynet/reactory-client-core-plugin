import Reactory from '@reactory/reactory-core';

const defaultProfile = {
    __isnew: true,
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    businessUnit: '',
    peers: {
        organization: null,
        user: null,
        peers: []
    },
    memberships: [],
    avatar: null,
};

const userPeersQueryFragment = `
user {
    id
    firstName
    lastName
}
organization {
    id
    name
    avatar
},
peers {
    user {
        id
        firstName
        lastName
        email
        avatar
    }
    isInternal
    inviteSent
    confirmed
    confirmedAt
    relationship
}
allowEdit
confirmedAt
createdAt
updatedAt
`;

const nilf = () => { };

const ProfileStyles = (theme: any) => ({
    mainContainer: {
        width: '100%',
        maxWidth: '1024px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    margin: {
        margin: `${theme.spacing(1)}px`,
    },
    confirmed: {
        color: '#02603B'
    },
    notConfirmed: {
        color: theme.palette.primary.dark
    },
    textField: {
        width: '98%'
    },
    confirmedLabel: {
        margin: `${theme.spacing(1)}px`,
        marginLeft: `${theme.spacing(2)}px`,
    },
    avatarContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center'
    },
    saveContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: `${theme.spacing(3)}px`,
        marginBottom: `${theme.spacing(2)}px`,
    },
    assessorsContainerButton: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: `${theme.spacing(1)}px`,
        paddingBottom: `${theme.spacing(1)}px`
    },
    assessorsContainerBtnLeft: {
        display: 'flex',
        justifyContent: 'left',
        paddingTop: `${theme.spacing(1)}px`,
        paddingBottom: `${theme.spacing(1)}px`
    },
    uploadButton: {
        marginLeft: "12px"
    },
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        width: 80,
        height: 80,
    },
    general: {
        padding: `${theme.spacing(3)}px`,
    },
    hiddenInput: {
        display: 'none'
    },
    peerToolHeader: {
        paddingTop: `${theme.spacing(2)}px`,
        paddingBottom: `${theme.spacing(2)}px`,
    },
    profileTopMargin: {
        paddingTop: `${theme.spacing(4)}px`,
    },
    sectionHeaderText: {
        //textTransform: "uppercase",
        paddingTop: `${theme.spacing(3)}px`,
        paddingBottom: `${theme.spacing(2)}px`,
        paddingLeft: `${theme.spacing(1)}px`,
        paddingRight: `${theme.spacing(1)}px`,
        color: "#566779",
        fontWeight: 600,
    },
    activeOrganisation: {
        backgroundColor: theme.palette.primary.main,
    },
});


/**
 *  static propTypes = {
    profile: PropTypes.object.isRequired,
    profileTitle: PropTypes.string,        
    loading: PropTypes.bool,
    organizationId: PropTypes.string,
    onPeersConfirmed: PropTypes.func,
    surveyId: PropTypes.string,
    mode: PropTypes.string,
    isNew: PropTypes.bool,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    withPeers: PropTypes.bool,
    withAvatar: PropTypes.bool,
    withMembership: PropTypes.bool,
    withBackButton: PropTypes.bool,
    firstNameHelperText: PropTypes.string,
    surnameHelperText: PropTypes.string,
    emailHelperText: PropTypes.string,
    headerComponents: PropTypes.func,
    footerComponents: PropTypes.func,
    refetch: PropTypes.func
    };
 */


export interface IProfileProps extends Reactory.IReactoryComponentProps {
    profile: Reactory.Models.IUser,
    profileTitle: string,
    loading: boolean,
    organizationId: string,
    onPeersConfirmed: () => void
    mode: string,
    isNew: boolean,
    onCancel: () => void,
    onSave: (profile: Reactory.Models.IUser) => void,
    withPeers: boolean,
    withAvatar: boolean,
    withMembership: boolean,
    withBackButton: boolean,
    firstNameHelperText: string,
    surnameHelperText: string,
    emailHelperText: string,
    headerComponents: string,
    footerComponents: string,
    refetch: () => void
}

const Profile = (props: IProfileProps): JSX.Element => {

    const { reactory, loading } = props;

    const defaultProps = {
        profile: defaultProfile,
        loading: false,
        profileTitle: 'My Profile',
        mode: 'user',
        highlight: 'none',
        isNew: false,
        onCancel: nilf,
        onSave: nilf,
        withPeers: true,
        withAvatar: true,
        withMembership: true,
        withBackButton: true,
        firstNameHelperText: null,
        surnameHelperText: null,
        emailHelperText: null,
        headerComponents: (props) => {

        },
        footerComponents: (props) => {

        },
    };

    interface ProfileDependencies {
        React: Reactory.React,
        Material: Reactory.Client.Web.IMaterialModule,
        AlertDialog: React.FunctionComponent<any>,
        BasicModal: React.FunctionComponent<any>,
        Loading: React.FunctionComponent<any>,
        FullScreenModal: React.FunctionComponent<any>
        CreateProfile: React.FunctionComponent<any>
        UserListItem: React.FunctionComponent<any>
        Cropper: React.FunctionComponent<any>
        StaticContent: React.FunctionComponent<Reactory.Client.Components.StaticContentProps>,
        MaterialTable: React.FunctionComponent<any>,
        UserListWithSearch: React.FunctionComponent<any>
        ReactoryCreateUserMembership: React.FunctionComponent<any>
        MoresMyPersonalDemographics: React.FunctionComponent<any>
    }

    const components = [
        'react.React',
        'material-ui.Material',
        'material-ui.MaterialTable',
        'core.AlertDialog',
        'core.BasicModal',
        'core.Loading',
        'core.FullScreenModal',
        'core.CreateProfile',
        'core.UserListItem',
        'core.Cropper',
        'core.UserListWithSearch',
        'core.ReactoryCreateUserMembership',
        'mores.MoresMyPersonalDemographics',
    ];

    const {
        React,
        AlertDialog,
        BasicModal,
        Loading,
        FullScreenModal,
        MaterialTable,
        CreateProfile,
        UserListItem,
        UserListWithSearch,
        ReactoryCreateUserMembership,
        Cropper,
        MoresMyPersonalDemographics,
        Material,
        StaticContent
    } = reactory.getComponents<ProfileDependencies>(components)
    
    const [avatarMouseOver, setAvatarMouseOver] = React.useState(false);
    const [confirmRemovePeer, setConfirmRemovePeer] = React.useState<Reactory.Models.IUser>(null);
    const [showAddUserDialog, setShowAddUserDialog] = React.useState<boolean>(false);
    const [activeOrganizationId, setActiveOrganizationId] = React.useState(null);
    const [profile, setProfile] = React.useState<Reactory.Models.IUser>(props.profile);
    const [loadingPeers, setLoadingPeers] = React.useState<boolean>(null);
    const [selectedMembership, setSelectedMembership] = React.useState<Reactory.Models.IMembership>(null);
    const [showError, setShowError] = React.useState<boolean>(false);
    const [message, setShowMessage] = React.useState<string>(null);
    const [inviteEmail, setInviteEmail] = React.useState<string>(null);
    const [userSort, setUserSort] = React.useState<string>(null);
    const [avatarUpdated, setAvatarUpdated] = React.useState<boolean>(false);
    const [imageCropped, setImageCropped] = React.useState<boolean>(false);
    const [imageMustCrop, setImageMustCrop] = React.useState<boolean>(false);
    const [showPeerSelection, setShowPeerSelection] = React.useState<boolean>(false);
    const [selected_peer_list, setSelectedPeerList] = React.useState<any[]>([]);
    const [page, setPage] = React.useState<number>(1);
    const [emailValid, setEmailValid] = React.useState<boolean>(reactory.utils.isEmail(props.profile?.email ? props.profile?.email : ""))
    const [findPeersResult, setFindPeersResult] = React.useState<any[]>([]);
    const [display_add_membership, setDisplayAddMembership] = React.useState<boolean>(false);
    const [display_role_editor, setDisplayRoleEditor] = React.useState<boolean>(false);
    const [searching, setIsSearching] = React.useState<boolean>(false);
    const [showResult, setShowResult] = React.useState<boolean>(false);
    const [showConfirmDeleteUser, setShowConfirmDeleteUser] = React.useState<boolean>(false);
    const [userDeleted, setUserDeleted] = React.useState<boolean>(false);
    const [userDeletedMessage, setUserDeletedMessage] = React.useState(null);
    //const [userProfileImageFile, setUserProfileImageFile] = React.useState<any>(null)

    const userProfileImageFile = React.useRef<HTMLInputElement>(null);

    // this.state = {
    //     avatarMouseOver: false,
    //     profile: { ...props.profile },
    //     avatarUpdated: false,
    //     imageCropped: false,
    //     imageMustCrop: false,
    //     showPeerSelection: false,
    //     selectedMembership: null,
    //     selected_peer_list: [],
    //     page: 1,
    //     emailValid: props.profile.email && isEmail(props.profile.email) === true,
    //     help: props.reactory.queryObject.help === "true",
    //     helpTopic: props.reactory.queryObject.helptopics,
    //     highlight: props.reactory.queryObject.peerconfig === "true" ? "peers" : null,
    //     activeOrganisationId: props.organizationId,
    //     activeOrganisationIndex: 0,
    //     display_role_editor: false,
    // };




    React.useEffect(() => {
        setProfile(props.profile);
    }, [props.profile])


    const {
        moment,
        lodash
    } = reactory.utils;

    const {
        isNil,
    } = lodash;

    const {
        MaterialCore,
        MaterialStyles
    } = Material;

    const {
        Avatar,
        Accordion,
        AccordionDetails,
        AccordionSummary,
        Button,
        FormControlLabel,
        Grid,
        Icon,
        IconButton,
        ListItem,
        ListItemAvatar,
        ListItemText,
        Paper,
        Switch,
        TextField,
        Tooltip,
        Toolbar,
        Table,
        TableHead,
        TableCell,
        TableBody,
        TableRow,
        Typography
    } = MaterialCore;

    const classes = MaterialStyles.makeStyles(ProfileStyles)();
    debugger

    const onAvatarMouseOver = () => {
        setAvatarMouseOver(true)
    }

    const onAvatarMouseOut = () => {
        setAvatarMouseOver(false)
    }

    const activeOrganisation = (membership) => {
        let id = ''
        if (membership && membership.organization) id = membership.organization.id

        setActiveOrganizationId(id);
    }

    const refreshPeers = () => {

        const query = `
        query UserPeers($id: String! $organizationId: String) {
            userPeers(id: $id, organizationId: $organizationId){
                ${userPeersQueryFragment}
            }
        }
        `;

        const variables = {
            id: profile.id,
            organizationId: selectedMembership && selectedMembership.organization && selectedMembership.organization.id ? selectedMembership.organization.id : '*'
        }

        reactory.graphqlQuery<any, any>(query, variables, {}).then((result) => {
            //console.log('Result for query', result);
            if (result && result.data && result.data.userPeers) {
                // that.setState({ profile: { ...profile, peers: { ...result.data.userPeers } }, loadingPeers: false })
                setProfile({ ...profile, peers: { ...result.data.userPeers } });
                setLoadingPeers(false);
            }
            else {

                setProfile({
                    ...profile,
                    peers: {
                        user: profile.id,
                        organization: selectedMembership.organization.id,
                        allowEdit: true,
                        confirmedAt: null,
                        confirmed: false,
                        inviteSent: false,
                        peers: [],
                    }
                });
                setLoadingPeers(false);
            }
        }).catch((queryError) => {
            reactory.log('Error querying user assessors', { queryError }, 'error')
            setShowError(true);
            setShowMessage("Could not load the user data");
            setLoadingPeers(false);
        });
    }

    const onMembershipSelectionChanged = (membership, index) => {
        // this.setState({
        //     selectedMembership: membership,
        //     activeOrganisationIndex: index,
        //     loadingPeers: true
        // }, () => {
        //     refreshPeers()
        // });
    }

    const renderUser = () => {
        return <UserListItem user={profile} />
    }

    const inviteUserByEmail = () => {
        //console.log('Inviting user', this.state.inviteEmail);

        const doQuery = () => {
            const options = {
                searchString: inviteEmail,
                sort: userSort || 'email'
            };

            reactory.graphqlQuery<any[], any>(reactory.queries.Users.searchUser, options, {}).then((userResult) => {
                //console.log('Search Result', userResult);
                setFindPeersResult(userResult.data);
                setIsSearching(false);
                setShowResult(true);
                // that.setState({ findPeersResult: userResult, searching: false, showResult: true })
            }).catch((searchError) => {
                //console.log('Search Error', searchError);
                // that.setState({ searching: false, findPeersResult: [] })
            });
        }

        // that.setState({ searching: true, findPeersResult: [] }, doQuery)
    }

    const renderMemberships = () => {
        const { memberships } = profile
        const { withMembership } = props;
        const Content: JSX.Element = reactory.getComponent('core.StaticContent') as JSX.Element;



        if (withMembership === false) return null;

        const data = [];
        
        if (memberships && memberships.length) {
            memberships.forEach(m => data.push({ ...m }))
        }

        const defaultMembershipContent = (
            <>
                <Typography variant="h6">Organisation Membership(s)</Typography>
                <Typography variant="body2">
                    If you are registered to participate in other organizations, all your memberships will appear here. <br />
                    Selecting a membership will load your organisation structure, for that organisation or particular business unit. <br />
                </Typography>
                <Typography>
                    * Most users will only have one membership. These memberships are managed by the administrators for your organisation.
                </Typography>
            </>
        )



        const can_edit_roles = reactory.hasRole(['ADMIN']) === true;

        const onAddNewMembership = () => {
            //that.setState({ display_add_membership: true });
        };

        const onCloseAddMembership = () => {
            //that.setState({ display_add_membership: false });

        }

        const membershipList = (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Paper className={classes.general}>
                    <Table aria-label="simple table">
                        <caption>
                            <StaticContent
                                slug={"core-user-profile-memebership-intro"}
                                editRoles={["DEVELOPER", "ADMIN"]}
                                defaultValue={defaultMembershipContent} />
                        </caption>
                        <TableHead>
                            <TableRow>
                                <TableCell>Organisation</TableCell>
                                <TableCell>{can_edit_roles === true && <Button color="primary" onClick={onAddNewMembership}>ADD MEMBERSHIP</Button>}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((membership: Reactory.Models.IMembership, index) => {
                                let id = ''
                                if (membership && membership.organization) {
                                    id = membership.organization.id
                                }

                                let membershipText = `${membership.client.name} - APPLICATION MEMBERSHIP`;

                                if (membership.organization && membership.organization.name) {
                                    membershipText = `${membership.organization.name}`
                                }

                                if (membership.businessUnit && membership.businessUnit.name) {
                                    membershipText = `${membershipText} [${membership.businessUnit.name}]`;
                                }

                                return (
                                    <TableRow
                                        key={index}
                                        className={activeOrganizationId === id ? classes.activeOrganisation : ""}>
                                        <TableCell>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar style={{ marginRight: `8px` }}>
                                                        {membership &&
                                                            membership.organization &&
                                                            membership.organization.name
                                                            ? membership.organization.name.substring(0, 2)
                                                            : membership.client.name.substring(0, 2)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`${membershipText}`}
                                                    secondary={`Roles: ${membership.roles.map((r: string) => `${r}`)}`.trim()}
                                                />
                                            </ListItem>
                                        </TableCell>
                                        <TableCell align="right">
                                            {can_edit_roles === true && selectedMembership && selectedMembership.id === membership.id && <IconButton onClick={() => {
                                                // that.setState({ display_role_editor: true }, () => {
                                                //     if (membership.id !== that.state.selectedMembership.id) {
                                                //         that.onMembershipSelectionChanged(membership, index);
                                                //     }
                                                // })
                                            }}><Icon>edit</Icon></IconButton>}
                                            <IconButton
                                                onClick={() => {
                                                    onMembershipSelectionChanged(membership, index);
                                                    activeOrganisation(membership)
                                                }}>
                                                <Icon>chevron_right</Icon>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                            }
                        </TableBody>
                    </Table>
                    {selectedMembership !== null && <AlertDialog
                        title={`Update membership for ${selectedMembership && selectedMembership.organization ? selectedMembership.organization.name : `${selectedMembership.client.name} - APPLICATION MEMBERSHIP`}`}
                        open={display_role_editor === true && selectedMembership}
                        showCancel={false}
                        acceptTitle={'DONE'}
                        onAccept={() => {
                            setDisplayRoleEditor(false);
                            if (props.refetch) props.refetch();
                        }}
                    >
                        <Grid container>
                            {selectedMembership && reactory.$user.applicationRoles.map((applicationRole: string) => {

                                if (applicationRole !== 'ANON') {
                                    return (<Grid item xs={12} sm={12} md={12} lg={12}>
                                        <FormControlLabel
                                            control={<Switch size="small" checked={reactory.hasRole([applicationRole], selectedMembership.roles)} onChange={(evt) => {
                                                let roles = [...selectedMembership.roles];
                                                if (evt.target.checked === false) {
                                                    //remove the role
                                                    reactory.utils.lodash.remove(roles, r => r === applicationRole);
                                                } else {
                                                    roles.push(applicationRole);
                                                }

                                                let $membership: Reactory.Models.IMembership = { ...selectedMembership, roles };

                                                setSelectedMembership($membership);


                                                const mutation = `mutation ReactoryCoreSetRolesForMembership($user_id: String!, $id: String!, $roles: [String]!){
                                                    ReactoryCoreSetRolesForMembership(user_id: $user_id, id: $id, roles: $roles) {
                                                        success
                                                        message
                                                        payload
                                                    }
                                                }`;

                                                const variables = {
                                                    user_id: profile.id,
                                                    id: selectedMembership.id,
                                                    roles: selectedMembership.roles
                                                };

                                                interface TResult { ReactoryCoreSetRolesForMembership: { success: boolean, message: string, payload: any } }
                                                reactory.graphqlMutation<TResult, any>(mutation, variables).then(({ data, errors }) => {
                                                    if (errors) {
                                                        reactory.createNotification('Could not update the user roles.', { type: 'error', showInAppNotification: true });
                                                    }

                                                    if (data && data.ReactoryCoreSetRolesForMembership) {
                                                        const { success, message, payload } = data.ReactoryCoreSetRolesForMembership;
                                                        reactory.createNotification('Could not update the user roles.', { type: 'error', showInAppNotification: true });
                                                    }


                                                }).catch((error) => {
                                                    reactory.log('Could not process request', { error }, 'error');
                                                    reactory.createNotification('Could not update the user roles.', { type: 'error', showInAppNotification: true })
                                                });


                                            }} />}
                                            label={applicationRole}
                                        />

                                    </Grid>)
                                }

                            })}
                        </Grid>
                    </AlertDialog>}

                    {display_add_membership === true && <AlertDialog
                        open={true} title={`Add new membership for ${profile.firstName} ${profile.lastName}`}
                        showCancel={false}
                        onAccept={() => {
                            //that.setState({ display_add_membership: false }) 
                        }}
                        acceptTitle={'DONE'}>
                        <ReactoryCreateUserMembership user={profile} />
                    </AlertDialog>}
                </Paper>
            </Grid>
        );

        return membershipList;

    }

    const renderUserDemographics = (): JSX.Element | null => {

        const userDemographic = (
            <Grid item sm={12} xs={12} >
                <Paper>
                    <Typography className={classes.sectionHeaderText}>Demographics</Typography>
                    <MoresMyPersonalDemographics />
                </Paper>
            </Grid>
        );

        // return userDemographic;
        return null;

    }

    const renderPeers = () => {
        const { history, reactory, withPeers } = props;
        if (withPeers === false) return null


        const { peers, __isnew } = profile;


        const that = this;
        let content = null

        if (loadingPeers === true) return (<Loading title="Looking for assessors" />)

        //data field for table
        const data = [];
        if (peers && peers.peers) {
            peers.peers.map((entry, index) => {
                data.push({
                    ...entry.user,
                    fullName: `${entry.user.firstName} ${entry.user.lastName} `,
                    email: entry.user.email,
                    relationship: entry.relationship,
                    confirmed: entry.confirmed,
                    confirmedAt: entry.confirmedAt,
                    inviteSent: entry.inviteSent
                });
            });
        }


        if (__isnew) return null


        const setInviteEmail = evt => {
            // this.setState({ inviteEmail: evt.target.value })
        };

        const setPeerRelationShip = (peer, relationship, cb: Function = nilf) => {
            const mutation = `mutation SetPeerRelationShip($id: String!, $peer: String!, $organization: String!, $relationship: PeerType){
    setPeerRelationShip(id: $id, peer: $peer, organization: $organization, relationship: $relationship){
        ${userPeersQueryFragment}
    }
} `;

            const variables = {
                id: profile.id,
                peer: peer.id,
                organization: selectedMembership.organization.id,
                relationship
            };

            reactory.graphqlMutation<any, any>(mutation, variables).then((peerResult) => {
                //console.log('Set the user peer relationship', peerResult)
                debugger;
                if (cb && peerResult.data.setPeerRelationShip) {
                    cb(peerResult.data.setPeerRelationShip)
                } else {
                    refreshPeers()
                }
            }).catch((peerSetError) => {
                console.error('Error setting peer relationship', peerSetError)
                refreshPeers()
            })
        };


        const removePeer = (peer, confirmRemovePeer) => {

            const mutation = reactory.utils.gql(`mutation RemovePeer($id: String!, $peer: String!, $organization: String!){
    removePeer(id: $id, peer: $peer, organization: $organization){
        ${userPeersQueryFragment}
    }
} `);

            const variables = {
                id: profile.id,
                peer: peer.id,
                organization: selectedMembership.organization.id,
            };

            reactory.graphqlMutation(mutation, variables).then((peerResult) => {
                //if(cb) cb(peerResult)                
                if (confirmRemovePeer) {
                    // that.setState({ confirmRemovePeer: null }, that.refreshPeers)
                    reactory.emit('mores_onDelegateAction_confirm-delegate', {

                    })
                } else {
                    // that.refreshPeers();
                }
            }).catch((peerSetError) => {
                console.error('Error removing peer from member', peerSetError)
                // that.refreshPeers()
            })
        }

        const confirmPeers = (confirmed) => {
            let surveyId = localStorage.getItem('surveyId')
            if (confirmed === true) {
                const mutation = `mutation ConfirmPeers($id: String!, $organization: String!, $surveyId: String){
                    confirmPeers(id: $id, organization: $organization, surveyId: $surveyId){
                        ${userPeersQueryFragment}
                    }
                } `;

                const variables = {
                    id: profile.id,
                    organization: selectedMembership.organization.id,
                    surveyId: surveyId
                };
                reactory.graphqlMutation<any, any>(mutation, variables).then(result => {
                    if (result && result.data && result.data.confirmPeers) {
                        const updated_profile = { ...profile, peers: { ...profile.peers, ...result.data.confirmPeers } }
                        // that.setState({ showConfirmPeersDialog: false, profile: updated_profile }, that.refreshPeers)
                        reactory.emit('mores_onDelegateAction_confirm-delegate', {
                            profile: updated_profile,
                            surveyId
                        })
                    }
                }).catch(ex => {
                    // that.setState({ showConfirmPeersDialog: false, showMessage: true, message: 'An error occured confirming assessor settings' })

                });
            } else {
                // that.setState({ showConfirmPeersDialog: true })
            }
        };

        const setUserPeerSelection = (selection) => {
            setPeerRelationShip(selection, 'peer', (result) => {
                // that.setState({ profile: { ...profile, peers: { ...result }  } })
                refreshPeers()
            });
        };

        const acceptUserSelection = () => {
            // setState({ showPeerSelection: false });
        }

        const editUserSelection = () => {
            // that.setState({ showAddUserDialog: true });
        }

        const membershipSelected = selectedMembership &&
            selectedMembership.organization &&
            selectedMembership.organization.id;

        const closeSelection = () => {
            // that.setState({ showPeerSelection: false });
        }

        const onNewPeerClicked = (e) => {
            // that.setState({ showAddUserDialog: true });
        };

        let excludedUsers = [profile.id]

        if (peers && peers.peers) peers.peers.forEach(p => (excludedUsers.push(p.user.id)))
        let confirmPeersDialog = null
        // if (showConfirmPeersDialog === true) {
        //     const closeConfirmDialog = () => {
        //         that.setState({ showConfirmPeersDialog: false });
        //     }

        //     const doConfirm = () => {
        //         confirmPeers(true);
        //     }

        //     confirmPeersDialog = (
        //         <BasicModal open={true}>
        //             <Typography variant="caption">Thank you for confirming.</Typography>
        //             <Button color="primary" onClick={doConfirm}>Ok</Button>
        //         </BasicModal>)
        // }

        let addUserDialog = null;
        // const closeAddUserDialog = () => {
        //     that.setState({ showAddUserDialog: false });
        // };

        // const doConfirm = () => {
        //     that.setState({ showAddUserDialog: false });
        // };



        let materialTable = null;
        if (isNil(membershipSelected) === false) {
            materialTable = (<MaterialTable
                options={{ pageSize: 10 }}
                components={{
                    Toolbar: props => {
                        return (
                            <div>
                                <>TOOLBAR NEEDED</>
                                <hr />
                                <Typography className={peers.confirmedAt ?
                                    reactory.utils.classNames([classes.confirmedLabel, classes.notConfirmed]) :
                                    reactory.utils.classNames([classes.confirmedLabel, classes.confirmed])}
                                    variant={"body1"}>{reactory.utils.moment(peers.confirmedAt).isValid() === true ? `Last Confirmed: ${reactory.utils.moment(peers.confirmedAt).format('YYYY-MM-DD')} (Year Month Day)` : 'Once completed, please confirm your assessors'}</Typography>
                            </div>
                        )
                    }
                }}
                columns={[
                    { title: 'Delegate', field: 'fullName' },
                    { title: 'Email', field: 'email' },
                    {
                        title: 'Relationship',
                        field: 'relationship',
                        render: (rowData) => {
                            switch (rowData.relationship.toLowerCase()) {
                                case 'manager': {
                                    return 'LEADER'
                                }
                                default: {
                                    return rowData.relationship.toUpperCase()
                                }
                            }
                        }
                    },
                ]}
                data={data}
                title={`User Peers in Organisation ${selectedMembership.organization.name} `}
                actions={[
                    rowData => ({
                        icon: 'supervisor_account',
                        tooltip: 'Set user as leader',
                        //@ts-ignore
                        disabled: rowData.relationship ? rowData.relationship === 'manager' : false,
                        onClick: (event, rowData) => {
                            ////console.log('Making User Supervisor', { event, rowData });
                            setPeerRelationShip(rowData, 'manager')
                        },
                    }),
                    rowData => ({
                        icon: 'account_box',
                        tooltip: 'Set user as peer',
                        //@ts-ignore
                        disabled: rowData.relationship ? rowData.relationship === 'peer' : false,
                        onClick: (event, rowData) => {
                            ////console.log('Setting User Peer', { event, rowData });
                            setPeerRelationShip(rowData, 'peer')
                        },
                    }),
                    rowData => ({
                        icon: 'account_circle',
                        tooltip: 'Set user as direct report',
                        //@ts-ignore
                        disabled: rowData.relationship ? rowData.relationship === 'report' : false,
                        onClick: (event, rowData) => {
                            setPeerRelationShip(rowData, 'report')
                        },
                    }),
                    rowData => ({
                        icon: 'delete_outline',
                        tooltip: 'Delete user from assessors',
                        disabled: false,
                        onClick: (event, rowData) => {
                            // removePeer(rowData);
                        },
                    }),
                    {
                        icon: 'check_circle',
                        tooltip: data.length < 5 ? 'Remember to nominate a total of at least 5 people' : (peers.confirmedAt ? `Assessors last confirmed at ${reactory.utils.moment(peers.confirmedAt).format('YYYY-MM-DD')} ` : 'Confirm peer selection'),
                        disabled: data.length < 5,
                        isFreeAction: true,
                        onClick: (event, rowData) => {
                            confirmPeers(false);
                        },
                    },
                    {
                        icon: 'edit',
                        tooltip: 'Edit Selection',
                        disabled: false,
                        isFreeAction: true,
                        onClick: (event, rowData) => {
                            // //console.log('Edit peer selection', { event, rowData });
                            editUserSelection();
                        },
                    }
                ]}
            />);


            const defaultInstructions = (
                <>
                    <Typography variant="body1">
                        Use the list below to manage your assessors.  Click on the <Icon>add_circle_outline</Icon> above to add a new colleague to your list.
                    </Typography>
                    <Typography variant="body1">
                        If you need to edit the details of an existing colleague you nominated previously, click on their name or the <Icon>expand</Icon> icon. This will enable you to change
                        the relationship type (LEADER, PEER, DIRECT REPORT) or remove the peer by clicking the <Icon>delete_outline</Icon> button.<br />
                        Once you have selected a minimum of six assessors (a maximum of 10),  please click the <Icon>check_circle</Icon> button to confirm your peer selection.<br />
                        Your assessors will only be notified of their nomination a maximum of once every 30 days.
                    </Typography>
                    <hr />
                    <Typography className={peers.confirmedAt ?
                        reactory.utils.classNames([classes.confirmedLabel, classes.notConfirmed]) :
                        reactory.utils.classNames([classes.confirmedLabel, classes.confirmed])}
                        variant={"body1"}>
                        {reactory.utils.moment(peers.confirmedAt).isValid() === true ? `Last Confirmed: ${reactory.utils.moment(peers.confirmedAt).format('YYYY-MM-DD')} (Year Month Day)` : 'Once completed, please confirm your assessors'}
                    </Typography>
                </>
            );

            const Content = reactory.getComponent('core.StaticContent');
            const contentProps = {
                defaultValue: defaultInstructions,
                slug: `core-assessors- nomination-instructions-${selectedMembership.client.id}-${selectedMembership.organization && selectedMembership.organization.id ? selectedMembership.organization.id : 'general'} `,
            }

            const { theme } = props;

            materialTable = (
                <Paper className={classes.general}>
                    {/* <Typography variant="h6">My assessors - {this.state.selectedMembership.organization.name}</Typography> */}
                    <Toolbar>
                        <Grid container spacing={2}>
                            <Grid container item direction="row">
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.assessorsContainerButton} style={{ display: data && Object.keys(data).length > 0 ? 'none' : 'flex' }}>
                                    <Typography variant="body2" color={'primary'}>You do not yet have any assessors. Assessors are the employees of your organisation who will be completing surveys for you.</Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={data && Object.keys(data).length > 0 ? classes.assessorsContainerBtnLeft : classes.assessorsContainerButton}>
                                    <Tooltip title="Click here to add new assessors">
                                        <Button color="secondary" variant="contained" component="span" onClick={editUserSelection} style={{ marginRight: '12px' }}><Icon>add</Icon>ADD ASSESSORS</Button>
                                    </Tooltip>

                                    <Tooltip title={reactory.utils.moment(peers.confirmedAt).isValid() === true ? `Last Confirmed: ${moment(peers.confirmedAt).format('YYYY-MM-DD')} (Year Month Day)` : 'Once you have selected all your organisation assessors, please confirm by clicking here.'}>
                                        <Button disabled={peers.peers.length === 0} color="secondary" variant="contained" component="span" onClick={e => confirmPeers(false)} >
                                            <Icon>check_circle</Icon> CONFIRM YOUR NOMINATIONS
                                        </Button>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>


                        {/* */}
                    </Toolbar>
                    {/* <Paper className={classes.peerToolHeader} elevation={2}>
                        <Content {...contentProps} />
                    </Paper> */}
                    <div>
                        {
                            data.map(usr => {
                                // console.log('Binding peer user', usr);
                                const makeSupervisor = e => setPeerRelationShip(usr, 'manager');
                                const makePeer = e => setPeerRelationShip(usr, 'peer');
                                const makeDirectReport = e => setPeerRelationShip(usr, 'report');
                                const deletePeer = e => {
                                    //
                                }

                                let expanded = false

                                const handleChange = event => {

                                    // if (expanded === usr.id) {
                                    //     // that.setState({
                                    //     //     expanded: null,
                                    //     // });
                                    // }
                                    // else {
                                    //     // that.setState({
                                    //     //     expanded: usr.id,
                                    //     // });
                                    // }
                                };

                                const isManager = usr.relationship === 'manager';
                                const isDirectReport = usr.relationship === 'report';
                                const isPeer = usr.relationship === 'peer';

                                //const { confirmRemovePeer = { id: '' } } = that.state;

                                let mustConfirmRemovePeer: boolean = false;

                                if (confirmRemovePeer !== null) {
                                    mustConfirmRemovePeer = confirmRemovePeer.id === usr.id;
                                }

                                const selectorWidget = (
                                    <Grid container>

                                        {mustConfirmRemovePeer === false && <Grid item container sm={12} md={12} lg={12} direction="row">

                                            <Tooltip title={`${isManager === true ? `${usr.firstName} ${usr.lastName} is flagged as a leader` : `Click to indicate you report to ${usr.firstName} ${usr.lastName}`} `}>
                                                <IconButton key={0} disabled={isManager === true} onClick={isManager === false ? makeSupervisor : nilf}>
                                                    <Icon>supervisor_account</Icon>
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip key={1} title={`${isPeer === false ? `Click to set ${usr.firstName} as a peer` : `${usr.firstName} ${usr.lastName} is set as a peer`} `}>
                                                <IconButton disabled={isPeer === true} onClick={isPeer === false ? makePeer : nilf}>
                                                    <Icon>account_box</Icon>
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip key={2} title={`${isDirectReport === false ? `Click to set ${usr.firstName} as a direct report` : `${usr.firstName} ${usr.lastName} is set as a report`} `}>
                                                <IconButton disabled={isDirectReport === true} onClick={isDirectReport === false ? makeDirectReport : nilf}>
                                                    <Icon>account_circle</Icon>
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip key={3} title={`Click to remove ${usr.firstName} as a colleague`}>
                                                <IconButton onClick={deletePeer} style={{ backgroundColor: theme.palette.error.main, color: theme.palette.error.contrastText }}>
                                                    <Icon>delete_outline</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>}
                                        {
                                            mustConfirmRemovePeer === true && <Grid item container sm={12} md={12} lg={12} direction="row">
                                                <Typography variant="body1" style={{ marginTop: '6px', marginRight: '14px' }}>Please confirm you wish to remove {usr.firstName} as a {usr.relationship}?</Typography>
                                                <Button onClick={() => {
                                                    //that.setState({ confirmRemovePeer: null })
                                                }}>CANCEL</Button>
                                                <Button onClick={() => {
                                                    //removePeer(confirmRemovePeer);
                                                }} style={{
                                                    backgroundColor: theme.palette.error.main,
                                                    color: theme.palette.error.contrastText
                                                }}>YES, REMOVE</Button>
                                            </Grid>
                                        }
                                    </Grid>
                                );

                                let relationshipBadge = null;
                                switch (usr.relationship.toLowerCase()) {
                                    case 'manager': {
                                        relationshipBadge = "LEADER";
                                        break;
                                    }
                                    default: {
                                        relationshipBadge = usr.relationship.toUpperCase();
                                        break;
                                    }
                                }

                                return (<Accordion
                                    key={usr.id}
                                    square
                                    expanded={expanded === usr.id}
                                >
                                    <AccordionSummary onClick={handleChange} expandIcon={expanded === usr.id ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}>
                                        <UserListItem user={usr} message={`Configured as a ${relationshipBadge.toLowerCase()} and ${usr.inviteSent === true ? ` a confirmation email was sent to ${usr.email} at ` + reactory.utils.moment(usr.confirmedAt).format('YYYY-MM-DD') : 'no confirmation email has been sent'} `} onSecondaryClick={handleChange} onClick={handleChange} />
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {selectorWidget}
                                    </AccordionDetails>
                                </Accordion>)
                            })
                        }
                    </div>
                </Paper>
            )
        }

        if (isNil(membershipSelected) === false) {

            const { organization } = selectedMembership;

            /**
             * 
             * 
             * 
             */


            const Content = reactory.getComponent('core.StaticContent');
            const { ReactoryForm } = reactory.getComponents(['core.ReactoryForm'])

            const InModal = ({ onDone = () => { } }) => {

                const [selected_peer_list, setSeletedPeerList] = React.useState<any[]>([]);
                const [show_new_user_modal, setShowNewUser] = React.useState<boolean>(false);
                const [page, setPage] = React.useState(1);
                const [page_size, setPageSize] = React.useState(25);
                const [is_updating, setIsUpdating] = React.useState(false);

                const setUserListSelected = (selection) => {
                    setSeletedPeerList(selection);
                };

                const addUserToSelection = (userToAdd) => {
                    if (profile.id === userToAdd.id) {
                        reactory.createNotification(props.mode === 'admin' ? 'A user may not be their own peer, the organigram matrix does not permit this. 🧐' : 'You cannot be your own colleague, the organigram matrix will collapse 🧐', { type: 'warning', showInAppNotification: true, timeout: 4500 })
                        return;
                    }
                    let $selected = [...selected_peer_list, userToAdd];
                    $selected = reactory.utils.lodash.sortBy($selected, (user) => { return `${user.firstName} ${user.lastName}` });
                    setSeletedPeerList($selected);
                };

                const onPageChange = (page) => {
                    setPage(page);
                };


                const onUserCreated = (user) => {
                    addUserToSelection(user);
                    setShowNewUser(false);
                };



                return (<>
                    <StaticContent slug={`profile-organigram-${show_new_user_modal ? 'add' : 'find'}`} />
                    {
                        show_new_user_modal === true ?
                            <CreateProfile
                                onUserCreated={onUserCreated} profileTitle="Invite new peer / colleague"
                                formProps={{ withBackButton: false, withAvatar: false, withPeers: false, withMembership: false, mode: 'peer' }}
                                firstNameHelperText="Firstname for your colleague / peer"
                                surnameHelperText="Surname for your colleague / peer"
                                emailHelperText="Email for your colleague / peer"
                                organizationId={selectedMembership.organization.id} /> : <UserListWithSearch
                                onUserSelect={(user, index) => {

                                    const findex = reactory.utils.lodash.findIndex(selected_peer_list, (u: any) => { return u.id === user.id });

                                    if (findex === -1)
                                        addUserToSelection(user);
                                    else {
                                        let new_selection = [...selected_peer_list];
                                        reactory.utils.lodash.pullAt(new_selection, findex)
                                        setUserListSelected(new_selection);
                                    }

                                }}
                                onClearSelection={() => {
                                    setUserListSelected([]);
                                }}
                                organization_id={organization.id}
                                onNewUserClick={() => {
                                    setShowNewUser(true);
                                }}
                                onAcceptSelection={(selected_users) => {

                                    if (selected_users.length === selected_peer_list.length) {
                                        Promise.all(selected_peer_list.map((user) => {
                                            return new Promise((resolve, reject) => {
                                                setPeerRelationShip(user, 'peer', (result) => {

                                                    resolve(result);
                                                })
                                            });
                                        })).then((results: any[]) => {


                                            reactory.log('Completed all results', { results }, 'debug')

                                        }).catch((error) => {


                                        });


                                    }
                                }}
                                skip={true}
                                allowNew={true}
                                selected={selected_peer_list.map(u => u.id)}
                                excluded={data.map(u => u.id)}
                                multiSelect={true}
                                mode={'list'}
                                page={page || 1}
                                pageSize={page_size || 25}
                                onPageChange={onPageChange} />
                    }</>);

            }

            const closeAddUserDialog = () => {
                setShowAddUserDialog(false);
            }

            addUserDialog = (
                <FullScreenModal open={showAddUserDialog === true} title={`${props.mode === 'admin' ? 'Add assessors for user ' : 'Add your assessors'}`} onClose={closeAddUserDialog}>
                    <InModal />
                </FullScreenModal>
            );
        }

        const peersComponent = (
            <Grid item sm={12} xs={12}>
                {confirmPeersDialog}
                {addUserDialog}
                {
                    !membershipSelected &&
                    <Paper className={classes.general}><Typography variant="body2">Select a membership with an organization organization to load assessors</Typography></Paper>
                }
                {
                    membershipSelected &&
                    !showPeerSelection && materialTable
                }
            </Grid>
        )

        return peersComponent;
    }

    const renderGeneral = () => {
        
        
        const { firstName, lastName, businessUnit, email, mobileNumber, avatar, peers, surveys, teams, __isnew, id, deleted } = profile;
        
        const defaultFieldProps = {
            fullWidth: true,
            InputLabelProps: {
                shrink: true
            },
        };

        const saveDisabled = (emailValid === false ||
            ((firstName) || isNil(lastName)) === true ||
            ((firstName.length < 2 || lastName.length < 2)));



        const doSave = () => {
            let $profile = { ...profile }
            //cleanup for save
            if ($profile.peers) delete profile.peers
            if ($profile.surveys) delete profile.surveys
            if ($profile.teams) delete profile.teams
            if ($profile.notifications) delete profile.notifications
            if ($profile.memberships) delete profile.memberships
            $profile.authProvider = 'LOCAL'
            $profile.providerId = 'reactory-system'

            props.onSave($profile)
        };

        const back = () => {
            history.back();
        }

        const onFileClick = () => {
            let preview = null;
            let file = userProfileImageFile.current.files[0];
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                preview = reader.result;
                //that.setState({ profile: { ...profile, avatar: preview }, imageMustCrop: true, avatarUpdated: true });
                setProfile({ ...profile, avatar: preview });
                setImageMustCrop(true);
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
        }

        const updateFirstname = (event: React.ChangeEvent<HTMLInputElement>) => {
            //that.setState({ profile: { ...profile, firstName: evt.target.value } })
            setProfile({ ...profile, firstName: event.currentTarget.value })
        };

        const updateLastname = (evt: React.ChangeEvent<HTMLInputElement>) => {
            // that.setState({ profile: { ...profile, lastName: evt.target.value } })
            setProfile({ ...profile, lastName: evt.currentTarget.value })
        };

        const updateEmail = (evt: React.ChangeEvent<HTMLInputElement>) => {
            // that.setState({ profile: { ...profile, email: evt.target.value }, emailValid: isEmail(evt.target.value) })
            setProfile({ ...profile, email: evt.currentTarget.value })
            setEmailValid(reactory.utils.isEmail(evt.currentTarget.value))
        };

        const updateMobileNumber = (evt: React.ChangeEvent<HTMLInputElement>) => {
            // that.setState({ profile: { ...profile, mobileNumber: evt.target.value } })
            setProfile({ ...profile, mobileNumber: evt.currentTarget.value })
        };


        const onSurnameKeyPress = (evt) => {
            if (evt.charCode === 13 && saveDisabled === false) {
                doSave();
            }
        }

        let avatarComponent = null;
        avatarComponent = (
            <div className={classes.avatarContainer}>
                <Tooltip title={`Click on the UPLOAD PHOTO button to change you profile picture`}>
                    <Avatar
                        src={avatarUpdated === false ? reactory.getAvatar(profile, null) : profile.avatar} alt={`${firstName} ${lastName} `}
                        className={reactory.utils.classNames(classes.avatar, classes.bigAvatar, avatarMouseOver === true ? classes.avatarHover : '')}
                        onMouseOver={onAvatarMouseOver}
                        onMouseOut={onAvatarMouseOut} />
                </Tooltip>

                <input accept="image/png"
                    className={classes.hiddenInput}
                    onChange={onFileClick}
                    id="icon-button-file"
                    type="file"
                    ref={(inputRef) => userProfileImageFile.current = inputRef} />
                <label htmlFor="icon-button-file">
                    <Tooltip title={`Select a png image that is less than 350kb in size.`}>
                        <Button color="primary" variant="outlined" component="span" className={classes.uploadButton}>Upload Photo</Button>
                    </Tooltip>
                </label>
            </div>);


        return (
            <Grid item sm={12} xs={12}>
                <Paper className={classes.general}>
                    <form>
                        <Grid container spacing={4}>
                            <Grid item sm={12} xs={12} >
                                {props.withAvatar === true ? avatarComponent : null}
                            </Grid>
                            <Grid item sm={6} xs={6}>
                                <TextField variant='standard' {...defaultFieldProps} label='First Name' value={firstName} onChange={updateFirstname} />
                            </Grid>
                            <Grid item sm={6} xs={6} >
                                <TextField variant='standard' {...defaultFieldProps} label='Last Name' value={lastName} onChange={updateLastname} onKeyPressCapture={onSurnameKeyPress} />
                            </Grid>
                            <Grid item sm={6} xs={6} >
                                <TextField variant='standard' {...defaultFieldProps} label={emailValid === true ? 'Email Address' : 'Email!'} value={email} onChange={updateEmail} />
                            </Grid>
                            <Grid item sm={6} xs={6} >
                                <TextField variant='standard' {...defaultFieldProps} label='Mobile Number' value={mobileNumber} onChange={updateMobileNumber} />
                            </Grid>
                        </Grid>
                    </form>

                    <div className={classes.saveContainer}>
                        <Button color='primary' variant='contained' onClick={doSave} disabled={saveDisabled}>SAVE CHANGES</Button>
                    </div>
                </Paper>
            </Grid>)
    }

    const renderHeader = () => {

        if (props.mode !== 'admin') return null;

        const onDeleteClick = e => {
            // that.setState({ showConfirmDeleteUser: true })
            setShowConfirmDeleteUser(true);
        };

        let confirmDeleteModal = null;

        if (showConfirmDeleteUser === true) {

            const cancelProfileDelete = e => {
                //that.setState({ showConfirmDeleteUser: false, userDeleteMessage: null, userDeleted: false });
                setShowConfirmDeleteUser(false);
                setUserDeletedMessage(null);
                setUserDeleted(false);
            };

            const deleteUserProfile = e => {
                const mutation = reactory.utils.gql` mutation DeleteUserMutation($id: String!){
                    deleteUser(id: $id)
                } `;

                reactory.graphqlMutation(mutation, { id: profile.id }).then(result => {
                    if (result.errors) {
                        setUserDeletedMessage("Could not delete the user at this time, please try again later or contact administrator if the problem persists");
                    } else {
                        // that.setState({ showConfirmDeleteUser: false, userDeleted: true, profile: { ...profile, deleted: true } });

                        setShowConfirmDeleteUser(false);
                        setUserDeleted(true);
                        setProfile({ ...profile, deleted: true });
                    }
                }).catch(error => {
                    // that.setState({ userDeleteMessage: "Could not delete the user due to an unknown error, please contact the administrator if this problem persists" })
                    setUserDeletedMessage("Could not delete the user at this time, please try again later or contact administrator if the problem persists");
                });
            };

            confirmDeleteModal = (
                <BasicModal open={true}>
                    <Typography>Are you sure you want to delete the account for {profile.firstName} {profile.lastName}</Typography>
                    <Button type="button" variant="text" onClick={cancelProfileDelete}>No, I changed my mind</Button>
                    <Button type="button" variant="contained" color="primary" onClick={deleteUserProfile}>Yes, delete user account</Button>
                </BasicModal>
            );

            if (userDeletedMessage) {
                confirmDeleteModal = (
                    <BasicModal open={true}>
                        <Typography>{userDeletedMessage}</Typography>
                        <Button type="button" variant="contained" color="primary" onClick={cancelProfileDelete}>Ok</Button>
                    </BasicModal>
                );
            }
        }

        return (
            <>
                <Toolbar>
                    <Typography variant="caption">Admin: {profile.firstName} {profile.lastName} {profile.deleted === true ? "[ User Deleted ]" : ""}</Typography>
                    {profile.deleted === true ? null : <Tooltip title="Click here to delete the user">
                        <IconButton onClick={onDeleteClick}>
                            <Icon>delete_outline</Icon>
                        </IconButton>
                    </Tooltip>}
                </Toolbar>
                {confirmDeleteModal}
            </>
        )
    }

    const renderFooter = () => {

    }

    const renderCropper = () => {
        const that = this;
        // const { Cropper, FullScreenModal } = this.componentDefs;
        const onModalClose = () => {
            //this.setState({ imageMustCrop: false })
        };

        const onCropAccept = (avatar) => {
            //;
            let preview: string = null
            let reader = new FileReader();

            reader.addEventListener("load", function () {
                preview = reader.result.toString();
                //that.setState({ profile: { ...profile, avatar: preview }, imageMustCrop: false, imageCropped: true, avatarUpdated: true });
                setProfile({ ...profile, avatar: preview });
                setImageMustCrop(false);
                setImageCropped(true);
                setAvatarUpdated(true);
            }, false);

            let xhr = new XMLHttpRequest();
            xhr.open("GET", avatar);
            xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
            xhr.onload = function () {
                reader.readAsDataURL(xhr.response);//xhr.response is now a blob object
            }
            xhr.send();
        }

        return (
            <FullScreenModal title="Crop your profile image" open={imageMustCrop} onClose={onModalClose}>
                <Cropper src={profile.avatar} onCancelCrop={onModalClose} onAccept={onCropAccept} crop={{ unit: '%', aspect: 1, width: '%' }}></Cropper>
            </FullScreenModal>
        );
    }


    const { nocontainer = false, isNew = false } = props;

    const containerProps = {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
    };


    let ProfileInGrid: JSX.Element = null
    if(loading === true) {
        ProfileInGrid = (<div>Loading</div>)
    } else {
        ProfileInGrid = (
            <Grid container spacing={2}>
                {
                 // renderHeader()
                }
                <Typography className={classes.sectionHeaderText}>PROFILE</Typography>
                {renderGeneral()}
                { 
                //renderUserDemographics()
                }
                {isNew === false && <Typography className={classes.sectionHeaderText}>My Assessors</Typography>}
                {
                //isNew === false ? renderMemberships() : null
                }
                {
                //isNew === false ? renderPeers() : null
                }
                {
                //isNew === false ? renderFooter() : null
                }
                {
                //isNew === false ? renderCropper() : null
                }
            </Grid>
        );
    }

    const Demographics: React.FunctionComponent<any> = reactory.getComponent('core.UserDemographics');

    /**
     * <Demographics user={profile}
                    heading={<Typography className={classes.sectionHeaderText}>Demographics</Typography>}
                    membership={selectedMembership}
                    organisationId={activeOrganizationId} />
     */

    if (nocontainer === false) {
        return (
            <div {...containerProps} className={classes.profileTopMargin}>
                {ProfileInGrid}
                
            </div>
        );
    } else {
        return ProfileInGrid
    }


}

type TProfile = typeof Profile;

const ProfileComponentRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TProfile> = {
    component: Profile,
    nameSpace: "core",
    name: "Profile",
    version: "1.0.0",
    componentType: "form",
    roles: ["USER", "ADMIN"],
    connectors: [],
    tags: ["user", "profile"],
}

export default ProfileComponentRegistration;