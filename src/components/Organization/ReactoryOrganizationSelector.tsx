
import React from 'react';
import { nameSpace } from '../../constants'
const dependencies = ['material-ui.Material', 'core.ReactoryForm', 'core.DropDownMenu'];

/**
 * Selector Widget that will provide a list of organizations that the
 * current logged in user has access to.  The source of this list
 * will be based on the memberships of the reactory logged in user.
 */
class ReactoryOrganizationSelector extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false
        }

        const { api } = props;

        this.components = api.getComponents(dependencies);
        this.emailTemplateEditorSubmit = this.emailTemplateEditorSubmit.bind(this);
    }


    emailTemplateEditorSubmit(formData) {
        const { api } = this.props;
        api.log('Email Template Editor Submit', { formData }, 'debug');
    }

    render() {
        try {

            const self = this;

            const { api,
                variant = 'dropdown',
                title = 'Select Organisation',
                selectedKey = null,
                allowNull = true,
                source = { 'USER': 'memberships' },
                selectedObjectMap = { 'id': 'id', 'name': 'name' },                            
                labelFormat = '${selectedOrganization.name}'
            } = this.props;

            const user = api.getUser();

            const organizations = [];
            let organizationHash = {};

            let selectedOrganization = { id: null, name: 'All Organizations' };
                        
            user.memberships.forEach((membership) => {
                const { organization } = membership;
                if (organization && organization.id && !organizationHash[organization.id] ) {
                    organizations.push(organization);
                    organizationHash[organization.id] = organization;
                    if (selectedKey === organization.id) selectedOrganization = organization;
                }                
            });

            

            const dropdownItems = [ {
                id: 'null',
                key: 'null',
                title: 'All Organizations', 
                icon: 'star',
                iconProps: {
                  style: {
                    color: '#5EB848'
                  }
                }
            }];

            organizations.forEach((organization) => {
                let organisation_menu_item = {
                    id: organization.id,
                    key: organization.id,
                    title: organization.name,
                    icon: organization.id === selectedKey ? 'check_outline' : null,
                    data: organization
                };
                dropdownItems.push(organisation_menu_item);
            });
            
            const { Material, ReactoryForm, DropDownMenu } = this.components;
            const { MaterialCore, MaterialStyles } = Material;
            const { Grid, Icon, TextField, Typography } = MaterialCore;

            const onOrganizationSelected = (evt, organisationItem) => {
                api.log('ReactoryOrganizationSelector on organizationSelected', { organisationItem }, 'debug');
                if (self.onChange) {
                    self.onChange(api.utils.objectMapper( organisationItem, selectedObjectMap ))
                }
            };

            let label = (<Typography variant="label">{api.utils.template(labelFormat)({ selectedOrganization })}</Typography>);            

            switch (variant) {
                case 'dropdown':
                default: {
                    return (
                        <>
                            {label}
                            <DropDownMenu
                                menus={dropdownItems}
                                onSelect={onOrganizationSelected} />
                        </>
                    );
                }
            }
            
        } catch (renderError) {
            return <>Organisation Selector 💥{renderError.message}</>
        }
    }
}

export default {
    nameSpace,
    name: 'ReactoryOrganizationSelector',
    version: '1.0.0',
    component: ReactoryOrganizationSelector,
};