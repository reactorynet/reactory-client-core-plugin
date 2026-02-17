import Reactory from '@reactorynet/reactory-core'

interface FormEditorProps {
    reactory: Reactory.Client.IReactoryApi,
    formData?: Reactory.Forms.IReactoryForm
}

interface IFormEditorDependencies {
    React: Reactory.React,
    Material: Reactory.Client.Web.IMaterialModule,
    ReactoryForm: React.FunctionComponent<Reactory.Client.IReactoryFormProps>
}


const DEFAULT_FORM_BASE_DATA: Reactory.Forms.IReactoryFormBase = {
    id: '',
    avatar: '',
    helpTopics: ['help-topic-'],
    icon: 'form',
    tags: ['form'],
    title: 'Your form title',
    uiFramework: 'material',
    uiResources: [],
    uiSupport: []    
}

const DEFAULT_FORM_SCHEMAS: Reactory.Forms.IReactoryFormSchemas = {
    schema: { 
        type: 'object',
        properties: {
            property1: {
                type: 'string',
                title: 'Property 1',
                description: 'Click edit to change this property'
            }
        }
    },
    uiSchema: {},
    uiSchemas: [],
    defaultUiSchemaKey: undefined,
    sanitizeSchema: undefined
}

const DEFAULT_FORM_ARGS: Reactory.Forms.IReactoryFormArgs = {
    argsComponentFqn: null,
    argsSchema: null,
    argsUiSchema: null
}

const DEFAULT_FORM_RUNTIME: Reactory.Forms.IReactoryFormRuntime = {
    name: 'NewForm',
    nameSpace: 'dynamic',
    version: '1.0.0',
    components: [],
    description: 'Your new component description',
    registerAsComponent: true,
    roles: ['USER'],
}

const NEW_FORM_DATA = {
    id: 'NewFormId',
    name: 'NewFormName',
    nameSpace: 'nameSpace',
    schema: {
        type: 'string',
        title: 'String Form'
    },
    uiSchema: {},
    avatar: '',
    argsComponentFqn: '',
    argsSchema: {
        type: 'string',
        title: 'arg1',
        description: 'Default argument'
    },
    argsUiSchema: {},
    backButton: true,
    cloneRoles: ['DEVELOPER'],
    components: [],
    componentDefs: [],
    defaultExport: null,
    defaultFormValue: 'Hallo Reactory.',
    defaultPdfReport: null,
    defaultUiSchemaKey: null,
    dependencies: [],
    description: 'New Form Description',
    editRoles: ['DEVELOPER'],
    eventBubbles: [],
    exports: [],
    fieldMap: undefined,
    graphql: null,
    icon: 'form',
    title: 'New Form',
    modules: [],
    version: '1.0.0',
    __complete__: true,
    allowClone: true,
    allowEdit: true,
};


const FormEditor = (props: FormEditorProps): JSX.Element => {    
    const { reactory, formData } = props;
    debugger;
    const { utils } = reactory;
    const { 
        React, 
        Material, 
        ReactoryForm 
    } = reactory.getComponents<IFormEditorDependencies>(['react.React', 'material-ui.Material', 'core.ReactoryForm']);
 
    const [reactoryForm, setReactoryForm] = React.useState<Reactory.Forms.IReactoryForm>(formData ? formData : NEW_FORM_DATA );
    const [formSchemas, setFormSchemas] = React.useState<Reactory.Forms.IReactoryFormSchemas>(DEFAULT_FORM_SCHEMAS);
    const [graphSchema, setDataDefinition] = React.useState({});
    const [formUiSchemas, setFormUISchemas] = React.useState<Reactory.Schema.IFormUISchema[]>([]);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const { Tabs, Box, Tab, Typography } = Material.MaterialCore;

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    

    const getSchema = (which: string): Reactory.Schema.ISchema => {
        
        switch(which) {
            case 'base': {
                return {
                    type: 'object',
                    title: reactory.i18n.t('reactory.formeditor.base.root.title', { defaultValue: 'Form Base Config' }),
                    description: reactory.i18n.t('reactory.formeditor.base.root.description', { defaultValue: 'Use base configuration input to edit basics for your form' }),
                    required: ['id'],
                    properties: {
                        id: { title: 'ID', type: 'string', description: 'Provide a unique id for your form' },
                        uiFramework: { type: 'string', title: 'UI Framework', description: 'Select the UI Framework for your form' },
                        uiSupport: { type: 'array', title: 'Supported Frameworks', items: { type: 'string', title: 'UI Framework' } },
                        uiResources: { 
                            type: 'array', 
                            title: 'UI Resources', 
                            description: 'Add required UI resources', 
                            items: { 
                                type: 'object',
                                title: 'UI Resource',
                                properties: {
                                    id: { type: 'string', title: 'Resource Id' },
                                    name: { type: 'string', title: 'Resource Name' },                                    
                                    uri: { type: 'string', title: 'Resource URI' },
                                    type: { 
                                        type: 'string', 
                                        title: 'Resource Type', 
                                        enum: [
                                            'script', 'style', 'image', 'video', 'audio', 'json', 'xml', 
                                            'html', 'text', 'pdf', 'binary', 'wasm', 'module', 'font',
                                            'image', 'icon', 'manifest', 'archive', 'package', 'certificate',
                                        ] 
                                    },
                                    required: { type: 'boolean' , title: 'Is Required' },
                                    expr: { type: 'string', title: 'Expression' },
                                    signed: { type: 'boolean', title: 'Is Signed' },
                                    crossOrigin: { type: 'boolean', title: 'Is Cross Origin' },
                                    signature: { type: 'string', title: 'Signature' },
                                    signatureMethod: { type: 'string', title: 'Signature Method' },
                                }
                            } 
                        },
                        title: { type: 'string', title: 'Form title' },
                        tags: { type: 'array', title: 'Supported Frameworks', items: { type: 'string', title: 'UI Framework' } },
                        avatar: { type: 'string', title: 'Avatar / Image' },
                        icon: { type: 'string', title: 'Icon'},
                        helpTopics: { type: 'array', title: 'Supported Frameworks', items: { type: 'string', title: 'Help Topic' } },                        
                    }
                }
            }
            case 'args': {
                return {
                    type: 'object',
                    title: reactory.i18n.t('reactory.formeditor.args.root.title', { defaultValue: 'Arguments / Input' }),
                    description: reactory.i18n.t('reactory.formeditor.args.root.description', { defaultValue: 'Use args editor to create data input bindings for your form' }),
                }
            }
            case 'schemas': {
                return {
                    type: 'object',
                    title: reactory.i18n.t('reactory.formeditor.schemas.root.title', { schema: 'Form Schemas / Data and UI' }),
                    description: reactory.i18n.t('reactory.formeditor.schemas.root.description', { defaultValue: 'Use args editor to create data input bindings for your form' }),
                    properties: {
                        schema: {
                            type: 'string',
                            title: 'Data / Form Schema',
                        },
                        sanitizeSchema: {
                            type: 'string',
                            title: 'Santize Schema'
                        },                        
                    }
                }
            }
            case 'uiSchemas': {
                return {
                    type: 'object',
                    title: reactory.i18n.t('reactory.formeditor.uiSchemas.root.title', { schema: 'Form UI Schemas' }),
                    description: reactory.i18n.t('reactory.formeditor.uiSchemas.root.description', { defaultValue: 'Use args editor to create data input bindings for your form' }),
                    properties: {
                        uiSchema: {
                            type: 'string',
                            title: 'UI Schema'
                        },
                        uiSchemas: {
                            type: 'array',
                            title: 'UI Schemas',
                            items: {
                                type: 'string',
                                title: 'UI Schema',                                
                            }
                        },
                    }
                }
            }
            case 'preview': {

                return {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            title: 'Title'
                        }
                    }
                }
            }
        }
    }

    const getUISchema = (which: string): Reactory.Schema.IFormUISchema => {
        switch(which) {
            case 'base': {
                return {
                    "ui:form": {
                    },
                    "ui:field": "GridLayout",
                    "ui:grid-layout": [
                        {
                            id: { xs: 12, sm: 12, md: 6, lg: 3 },
                            uiFramework: { xs: 12, sm: 12, md: 6, lg: 3 },
                            uiSupport: { xs: 12, sm: 12, md: 6, lg: 3 },
                        },
                        {
                            uiResources: { xs: 12, sm: 12, md: 6, lg: 3 },
                            title: { xs: 12, sm: 12, md: 6, lg: 3 },
                            tags: { xs: 12, sm: 12, md: 6, lg: 3 },
                        },
                        {
                            avatar: { xs: 12, sm: 12, md: 6, lg: 3 },
                            icon: { xs: 12, sm: 12, md: 6, lg: 3 },
                            helpTopics: { xs: 12, sm: 12, md: 6, lg: 3 },
                        }
                    ],
                    id: {
                        "ui:help": "Provide a unique id for your form",
                        "ui:placeholder": "Enter a unique id for your form"
                    },
                    uiFramework: {
                        "ui:help": "Select the UI Framework for your form",
                        "ui:placeholder": "Select the UI Framework for your form",
                        "ui:widget": "SelectWidget",
                        "ui:options": {
                            selectOptions: [
                                { key: 'material', value: 'material', label: 'Material UI' },
                                { key: 'bootstrap', value: 'bootstrap', label: 'Bootstrap' },                            
                            ]
                        }
                    },
                    uiSupport: {
                        "ui:help": "Select the UI Frameworks supported by your form",
                        "ui:widget": "SelectWidget",
                        "ui:options": {
                            multiple: true,
                            selectOptions: [
                                { key: 'material', value: 'material', label: 'Material UI' },
                                { key: 'bootstrap', value: 'bootstrap', label: 'Bootstrap' },                            
                            ]
                        }
                    },
                    uiResources: {
                        "ui:options": {
                            allowAdd: true,
                            allowDelete: true,
                            allowReorder: true,
                        }                        
                    }
                }
            }
            case 'args': {
                return {}
            }
            case 'runtime': {
                return {}
            }
            case 'preview': {
                return {}
            }
            case 'schema': {
                return {}
            }
        }
    }

    const getFormDefintion = (which: string): Reactory.Forms.IReactoryForm => {


        const formDef: Reactory.Forms.IReactoryForm = {
            id: `form-editor-${which}`,
            name: `FormEditor_${which}`,
            nameSpace: 'runtime',
            version: '1.0.0',
            schema: getSchema(which),
            uiSchema: getUISchema(which),
            helpTopics: [`form-editor-help-${which}`],
            uiFramework: 'material',
            __complete__: true,
            allowClone: false,
            allowEdit: false,
            argsComponentFqn: null,
            argsSchema: undefined,
            argsUiSchema: undefined,
            avatar: undefined,
            backButton: false,
            description: '',
        }

        return formDef;
    };

    const getDataMap = (which: string): any => {
        return {
            'id': 'id'
        }
    }

    
    return (
        <React.Fragment>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="General" {...a11yProps(0)} />
                    <Tab label="Schema" {...a11yProps(1)} />
                    <Tab label="UI Schema" {...a11yProps(2)} />
                    <Tab label="Data" {...a11yProps(3)} />
                    <Tab label="Preview" {...a11yProps(4)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <ReactoryForm
                    formDef={getFormDefintion('base')} 
                    formData={utils.objectMapper.merge(reactoryForm, getDataMap('base'))}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                Schema
                <ReactoryForm formDef={getFormDefintion('schemas')} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                UI Schema
                <ReactoryForm formDef={getFormDefintion('uiSchemas')} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                Data
                <ReactoryForm formDef={getFormDefintion('data')} />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <ReactoryForm formDef={getFormDefintion('preview')} />
            </TabPanel>
            
            
        </React.Fragment>
    )
}

export default FormEditor;