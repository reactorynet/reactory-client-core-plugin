import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router'
import { compose } from 'redux';
import gql from 'graphql-tag';
import { Query } from '@apollo/client/react/components';
import Paper from '@mui/Paper';
import { intersection, remove } from 'lodash'
import { List, ListItem, ListItemText, Typography, Button, Icon, Tooltip } from '@mui/material';
import { withReactory } from '../../api/ApiProvider';

/**
 * List component for user entries
 * @param {*} param0 
 */
class OrganizationList extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: [],
    }

    this.handleOrganizationSelect = this.handleOrganizationSelect.bind(this);
  }

  handleOrganizationSelect(organization) {

    if (intersection(this.state.selected, [organization.id]).length === 1) {
      //deselect  
      this.setState({ selected: remove(this.state.selected, organization.id) }, () => {
        if (this.props.onOrganizationClick) this.props.onOrganizationClick(organization, 'deselect');
        if (this.props.admin === true) this.props.history.push(`/admin/`);
      });
    } else {
      this.setState({ selected: [organization.id] }, () => {
        if (this.props.onOrganizationClick) this.props.onOrganizationClick(organization, 'select');
        if (this.props.admin === true) this.props.history.push(`/admin/org/${organization.id}/surveys`);
      });
    }
  }

  render() {
    const that = this;

    return <Query query={gql`query OrganizationQuery {
      allOrganizations {
        id
        code
        name
        logoURL
        avatar
        createdAt
        updatedAt
      }
  }`} options={{ name: 'organization' }}>
      {({ loading, data, error }, context) => {

        if (loading) return <p>loading organization</p>
        if (error) return <p>Error Occured Fetching Organization</p>


        const { allOrganizations } = data;
        const { match } = this.props;
        if (loading === true) {
          return <p>Fetching organizations ...</p>;
        }

        if (error) {
          return <p>{error.message}</p>;
        }

        const isSelected = (index) => {
          return this.state.selected.indexOf(index) !== -1;
        }

        const handleRowSelection = (selectedRows) => {
          this.setState({
            selected: selectedRows
          });
        }

        const organizationId = match.params.organizationId

        let newOrganizationLink = null;
        if (this.props.newOrganizationLink === true) {
          const selectNewLinkClick = () => { that.handleOrganizationSelect({ id: 'new', name: 'NEW ORGANIZATION' }) };
          newOrganizationLink = (<Button key={-1} color="primary" onClick={selectNewLinkClick}><Icon>add</Icon>NEW ORGANISATION</Button>)
        }

        const list = (
          <>
            <Button key={-2} color="secondary" onClick={() => { this.props.history.push(`${this.props.rootPath || '/admin/'}`) }}><Icon>date_range</Icon>CALENDAR</Button>
            {newOrganizationLink}
            <List>
              {allOrganizations.map((organization, index) => {
                if (organization) {

                  const selectOrganization = () => {
                    that.handleOrganizationSelect(organization);
                  }

                  const organizationSelected = intersection(that.state.selected, [organization.id]).length === 1;

                  return (
                    <ListItem selected={organizationSelected === true || organization.id === organizationId} key={index} dense button onClick={selectOrganization}>
                      <ListItemText primary={organization.name} />
                    </ListItem>)
                } else {
                  return null;
                }
              })}
            </List>
          </>
        );

        let component = null;
        if (this.props.wrapper === true) {
          component = (<Paper>
            {list}
          </Paper>)
        } else component = list;

        return component;

      }}
    </Query>
  }
};

OrganizationList.propTypes = {
  organizations: PropTypes.object,
  onOrganizationClick: PropTypes.func
};

OrganizationList.defaultProps = {

};


const OrganizationLabelForId = ({ organizationId, api }) => {
  return <Query query={gql`query OrganizationWithId($id: ObjID) {
    organizationWithId(id: $id)
    id
    name
    logo
  }`} variables={{ id: organizationId }} options={{ name: 'organization' }}>
    {({ loading, data, error }, context) => {

      if (loading) return <p>loading organization</p>
      if (error) return <p>Error Occured Fetching Organization</p>

      return <Typography>{data.organization.name}</Typography>
    }}
  </Query>
}

export const OrganizationLabelForIdComponent = compose(withReactory)(OrganizationLabelForId);

const organizationQuery = gql`
  query OrganizationQuery {
      allOrganizations {
        id
        code
        name
        logoURL
        avatar
        createdAt
        updatedAt
      }
  }
`;

export default compose(withRouter)(OrganizationList);