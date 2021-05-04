
import React from 'react';
import { nameSpace } from '../../constants'
const dependencies = ['material-ui.Material', 'core.ReactoryForm', 'core.DropDownMenu'];

/**
 * Selector Widget that will provide a list of organizations that the
 * current logged in user has access to.  The source of this list
 * will be based on the memberships of the reactory logged in user.
 */
class ReactoryClientSelector extends React.Component {

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
                title = 'Select Application',
                allowNull = true,
                selectedKey = null,
                source = { 'USER': 'memberships' },
                selectedObjectMap = { 'id': 'id', 'name': 'name' },                
                labelFormat = '${selectedClient && selectedClient.name ? selectedClient.name : "All Applications" }',
                formData = { id: null, name: 'All Applications'}
            } = this.props;

            let selectedClient = formData;

            const user = api.getUser();

            const clients = [];
            let clientHash = {};
            
            const menus_no_organizations = [
              
            ];

            user.memberships.forEach((membership) => {
                const { client } = membership;
                if (client && client.id && !clientHash[client.id] ) {
                    clients.push(client);
                    clientHash[client.id] = client;

                    if (selectedKey && selectedKey === client.id) selectedClient = client;
                }                
            });
            
            const dropdownItems = [];

            if (allowNull && selectedKey === null) {
                dropdownItems.push({
                    id: 'null',
                    key: 'null',
                    title: 'All Applications',
                    selected: true,
                    icon: 'star',
                    data: { id: null, name: 'All Applications' },
                    iconProps: {
                        style: {
                            color: '#5EB848'
                        }
                    }
                });
            }

            clients.forEach((client) => {
                let client_menu_item = {
                    id: client.id,
                    key: client.id,
                    title: client.name,
                    icon: client.id === selectedKey ? 'check_outline' : null,
                    data: client
                };

                dropdownItems.push(client_menu_item);
            });

            const { Material, ReactoryForm, DropDownMenu } = this.components;
            const { MaterialCore, MaterialStyles } = Material;
            const { Grid, Icon, TextField, Typography} = MaterialCore;

            const onClientSelected = (evt, reactoryClientItem) => {
                api.log('ReactoryClientSelector onClientSelected', { reactoryClientItem }, 'debug')
                //
                if (self.onChange) {
                    self.onChange(api.utils.objectMapper( reactoryClientItem.data, selectedObjectMap ))
                }
            };

            let label = 'Not set';
            
            if (typeof labelFormat === 'string') {
                try {
                    label = (<Typography variant="label">{api.utils.template(labelFormat)({ selectedClient })}</Typography>);
                } catch (err) {
                    //
                    label = (<Typography variant="label">Template error {err.message}</Typography>);
                }
            }

            if (typeof labelFormat === 'function') {
                try {
                    label = labelFormat({ selectedClient });
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
                                onSelect={onClientSelected} />
                        </>)        
                }
            }
            
        } catch (renderError) {
            return <>Reactory Client Selector 💥{renderError.message}</>
        }
    }
}

export default {
    nameSpace,
    name: 'ReactoryClientSelector',
    version: '1.0.0',
    component: ReactoryClientSelector,
};