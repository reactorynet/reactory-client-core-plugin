import TemplateEditors from './TemplateEditors';
import OrganizationComponents from './Organization';
import ReactoryClientComponents from './ReactoryClient';
import FormEditor from './Develop/FormEditor';

export const components = [
    ...ReactoryClientComponents,
    ...OrganizationComponents,
    ...TemplateEditors,
    
    {
        nameSpace: 'reactory',
        name: 'FormEditor',
        version: '1.0.0',
        component: FormEditor,
        roles: ['DEVELOPER'],
    }
    
];