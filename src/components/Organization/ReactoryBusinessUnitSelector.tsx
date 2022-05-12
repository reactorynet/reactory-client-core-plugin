
import React from 'react';
import { nameSpace } from '../../constants'
const dependencies = ['material-ui.Material', 'core.ReactoryForm', 'core.DropDownMenu'];

/**
 * Selector Widget that will provide a list of organizations that the
 * current logged in user has access to.  The source of this list
 * will be based on the memberships of the reactory logged in user.
 */
class ReactoryBusinessUnitSelector extends React.Component {

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
                allowNull = true,
                selectedKey = null,
                source = { 'USER': 'memberships' },
                selectedObjectMap = { 'id': 'id', 'name': 'name' },
                selectedBusinessUnit = null,
                selectedOrganization = null,
                labelFormat = '${selectedBusinessUnit && selectedBusinessUnit.name ? selectedBusinessUnit.name : "All Business Units" }',
                nullLabel = 'All Business Units'

            } = this.props;

            const user = api.getUser();

            const businessUnits = [];
            let businessUnitsHash = {};
                                       
            user.memberships.forEach((membership) => {
                const { organization, businessUnit } = membership;
                if (organization && organization.id && selectedOrganization.id === organization.id && businessUnit && businessUnit.id ) {
                    businessUnits.push(businessUnit);
                    businessUnitsHash[businessUnit.id] = businessUnit;
                }                
            });

            

            const dropdownItems = [];

            if (businessUnits.length === 0) {
                dropdownItems.push({
                    id: 'null',
                    key: 'null',
                    title: 'All Business Units',
                    icon: 'star',
                    data: { id: null, name: 'All Business Units'}
                })
            }

            businessUnits.forEach((businessUnit) => {
                let businessUnit_menu_item = {
                    id: businessUnit.id,
                    key: businessUnit.id,
                    title: businessUnit.name,
                    icon: businessUnit.id === selectedKey ? 'check_outline' : null,
                    data: businessUnit
                };

                dropdownItems.push(businessUnit_menu_item);
            });

            const { Material, ReactoryForm, DropDownMenu } = this.components;
            const { MaterialCore, MaterialStyles } = Material;
            const { Grid, Icon, TextField, Typography } = MaterialCore;

            const onBusinessUnitSelected = (evt, businessUnitItem) => {
                api.log('ReactoryBusinessUnitSelector on organizationSelected')
                if (self.onChange) {
                    self.onChange(api.utils.objectMapper( businessUnitItem.data, selectedObjectMap ))
                }
            };

            let label = 'Not set'

            if (typeof labelFormat === 'string') {
                try {
                    label = (<Typography variant="label">{api.utils.template(labelFormat)({ selectedBusinessUnit, selectedOrganization })}</Typography>);
                } catch (err) {
                    //
                    label = (<Typography variant="label">Template error {err.message}</Typography>);
                }
            }

            if (typeof labelFormat === 'function') {
                try {
                    label = labelFormat({ selectedBusinessUnit, selectedOrganization });
                } catch (err) {
                    //
                    label = (<Typography variant="label">Template error {err.message}</Typography>);
                }
            }            

            switch (variant) {
                case 'dropdown':
                default: {
                    return (
                        <>
                            {label}
                             <DropDownMenu 
                                menus={dropdownItems} 
                                onSelect={onBusinessUnitSelected} />
                        </>)        
                }
            }
            
        } catch (renderError) {
            return <>Business Unit Selector 💥{renderError.message}</>
        }
    }
}

export default {
    nameSpace,
    name: 'ReactoryBusinessUnitSelector',
    version: '1.0.0',
    component: ReactoryBusinessUnitSelector,
};