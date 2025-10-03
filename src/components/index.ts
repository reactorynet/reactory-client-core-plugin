import TemplateEditors from './TemplateEditors';
import OrganizationComponents from './Organization';
import ReactoryClientComponents from './ReactoryClient';
import UserComponents from './User';
import FormEditor from './Develop/FormEditor';
import FormEditorEnhanced from './Develop/FormEditorEnhanced';
import AuthenticationComponents from './Authentication';
export const components = [
    ...ReactoryClientComponents,
    ...OrganizationComponents,
    ...TemplateEditors,
    ...UserComponents,
    ...AuthenticationComponents,
    {
        nameSpace: 'reactory',
        name: 'FormEditor',
        version: '1.0.0',
        component: FormEditor,
        roles: ['DEVELOPER'],
    },
    {
        nameSpace: 'reactory',
        name: 'FormEditorEnhanced',
        version: '1.0.0',
        component: FormEditorEnhanced,
        roles: ['DEVELOPER'],
    }    
];