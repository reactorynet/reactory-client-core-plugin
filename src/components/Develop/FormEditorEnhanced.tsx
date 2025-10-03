import Reactory from '@reactory/reactory-core'

interface FormEditorEnhancedProps {
    reactory: Reactory.Client.IReactoryApi,
    formData?: Reactory.Forms.IReactoryForm
}

interface IFormEditorEnhancedDependencies {
    React: Reactory.React,
    Material: Reactory.Client.Web.IMaterialModule,
    ReactoryForm: React.FunctionComponent<Reactory.Client.IReactoryFormProps>,
    JsonSchemaEditor: React.FunctionComponent<any>
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

const FormEditorEnhanced = (props: FormEditorEnhancedProps): JSX.Element => {    
    const { reactory, formData } = props;
    const { utils } = reactory;
    
    // Get required components
    const { 
        React, 
        Material, 
        ReactoryForm,
        JsonSchemaEditor 
    } = reactory.getComponents<IFormEditorEnhancedDependencies>([
        'react.React', 
        'material-ui.Material', 
        'core.ReactoryForm',
        'shared.JsonSchemaEditor'
    ]);
 
    // State management
    const [reactoryForm, setReactoryForm] = React.useState<Reactory.Forms.IReactoryForm>(formData ? formData : NEW_FORM_DATA);
    const [formSchemas, setFormSchemas] = React.useState<Reactory.Forms.IReactoryFormSchemas>(DEFAULT_FORM_SCHEMAS);
    const [value, setValue] = React.useState(0);
    const [validationState, setValidationState] = React.useState({
        schema: { isValid: true, errors: [] },
        uiSchema: { isValid: true, errors: [] }
    });

    // Material UI components
    const { Tabs, Box, Tab, Typography, Alert, Paper } = Material.MaterialCore;

    // Tab change handler
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Schema validation handlers
    const handleSchemaValidation = (isValid: boolean, errors?: string[]) => {
        setValidationState(prev => ({
            ...prev,
            schema: { isValid, errors: errors || [] }
        }));
    };

    const handleUISchemaValidation = (isValid: boolean, errors?: string[]) => {
        setValidationState(prev => ({
            ...prev,
            uiSchema: { isValid, errors: errors || [] }
        }));
    };

    // Schema change handlers
    const handleSchemaChange = (newSchemaString: string) => {
        try {
            const parsed = JSON.parse(newSchemaString);
            setFormSchemas(prev => ({
                ...prev,
                schema: parsed
            }));
            
            // Update the main form data
            setReactoryForm(prev => ({
                ...prev,
                schema: parsed
            }));
        } catch (error) {
            console.warn('Invalid JSON schema:', error.message);
            // Keep the string value for editing
        }
    };

    const handleUISchemaChange = (newUISchemaString: string) => {
        try {
            const parsed = JSON.parse(newUISchemaString);
            setFormSchemas(prev => ({
                ...prev,
                uiSchema: parsed
            }));
            
            // Update the main form data
            setReactoryForm(prev => ({
                ...prev,
                uiSchema: parsed
            }));
        } catch (error) {
            console.warn('Invalid UI schema:', error.message);
            // Keep the string value for editing
        }
    };

    // Tab panel component
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`enhanced-tabpanel-${index}`}
                aria-labelledby={`enhanced-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index) {
        return {
            id: `enhanced-tab-${index}`,
            'aria-controls': `enhanced-tabpanel-${index}`,
        };
    }

    // Schema definitions for base form editing
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
                        title: { type: 'string', title: 'Form title' },
                        description: { type: 'string', title: 'Form Description' },
                        uiFramework: { type: 'string', title: 'UI Framework', description: 'Select the UI Framework for your form' },
                        icon: { type: 'string', title: 'Icon'},
                        avatar: { type: 'string', title: 'Avatar / Image' },
                    }
                }
            }
            case 'preview': {
                return (formSchemas.schema as Reactory.Schema.ISchema) || { type: 'object', properties: {} };
            }
            default:
                return { type: 'object', properties: {} };
        }
    };

    const getUISchema = (which: string): Reactory.Schema.IFormUISchema => {
        switch(which) {
            case 'base': {
                return {
                    "ui:field": "GridLayout",
                    "ui:grid-layout": [
                        {
                            id: { xs: 12, sm: 12, md: 6, lg: 6 },
                            title: { xs: 12, sm: 12, md: 6, lg: 6 }
                        },
                        {
                            description: { xs: 12, sm: 12, md: 12, lg: 12 }
                        },
                        {
                            uiFramework: { xs: 12, sm: 12, md: 6, lg: 3 },
                            icon: { xs: 12, sm: 12, md: 6, lg: 3 },
                            avatar: { xs: 12, sm: 12, md: 6, lg: 6 }
                        }
                    ],
                    uiFramework: {
                        "ui:widget": "SelectWidget",
                        "ui:options": {
                            selectOptions: [
                                { key: 'material', value: 'material', label: 'Material UI' },
                                { key: 'bootstrap', value: 'bootstrap', label: 'Bootstrap' },                            
                            ]
                        }
                    }
                }
            }
            case 'preview': {
                return formSchemas.uiSchema || {};
            }
            default:
                return {};
        }
    };

    const getFormDefinition = (which: string): Reactory.Forms.IReactoryForm => {
        const formDef: Reactory.Forms.IReactoryForm = {
            id: `form-editor-enhanced-${which}`,
            name: `FormEditorEnhanced_${which}`,
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
        switch(which) {
            case 'base':
                return {
                    id: reactoryForm.id,
                    title: reactoryForm.title,
                    description: reactoryForm.description,
                    uiFramework: reactoryForm.uiFramework,
                    icon: reactoryForm.icon,
                    avatar: reactoryForm.avatar
                };
            default:
                return {};
        }
    };

    // Validation status indicator
    const ValidationStatus = ({ isValid, errors, label }) => (
        <Box sx={{ mb: 2 }}>
            <Alert 
                severity={isValid ? 'success' : 'error'} 
                variant="outlined"
                sx={{ fontSize: '0.875rem' }}
            >
                <strong>{label}:</strong> {isValid ? 'Valid' : `${errors.length} error(s)`}
                {!isValid && errors.length > 0 && (
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {errors.slice(0, 3).map((error, index) => (
                            <li key={index} style={{ fontSize: '0.8rem' }}>{error}</li>
                        ))}
                        {errors.length > 3 && <li style={{ fontSize: '0.8rem' }}>...and {errors.length - 3} more</li>}
                    </ul>
                )}
            </Alert>
        </Box>
    );
    
    return (
        <React.Fragment>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="enhanced form editor tabs">
                    <Tab label="General" {...a11yProps(0)} />
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                Schema
                                {!validationState.schema.isValid && (
                                    <span style={{ color: 'error.main', fontSize: '0.75rem' }}>⚠️</span>
                                )}
                            </Box>
                        } 
                        {...a11yProps(1)} 
                    />
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                UI Schema
                                {!validationState.uiSchema.isValid && (
                                    <span style={{ color: 'error.main', fontSize: '0.75rem' }}>⚠️</span>
                                )}
                            </Box>
                        } 
                        {...a11yProps(2)} 
                    />
                    <Tab label="Preview" {...a11yProps(3)} />
                </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
                <Typography variant="h6" gutterBottom>
                    Form Configuration
                </Typography>
                <ReactoryForm
                    formDef={getFormDefinition('base')} 
                    formData={getDataMap('base')}
                    onChange={(formData) => {
                        setReactoryForm(prev => ({
                            ...prev,
                            ...formData
                        }));
                    }}
                />
            </TabPanel>

            <TabPanel value={value} index={1}>
                <ValidationStatus 
                    isValid={validationState.schema.isValid}
                    errors={validationState.schema.errors}
                    label="Data Schema Validation"
                />
                
                <Paper elevation={1} sx={{ p: 2 }}>
                    <JsonSchemaEditor
                        value={JSON.stringify(formSchemas.schema, null, 2)}
                        onChange={handleSchemaChange}
                        onValidationChange={handleSchemaValidation}
                        label="Form Data Schema"
                        placeholder="Enter JSON schema definition for form data validation..."
                        height={400}
                        showValidation={true}
                        formatOnBlur={true}
                    />
                </Paper>
            </TabPanel>

            <TabPanel value={value} index={2}>
                <ValidationStatus 
                    isValid={validationState.uiSchema.isValid}
                    errors={validationState.uiSchema.errors}
                    label="UI Schema Validation"
                />
                
                <Paper elevation={1} sx={{ p: 2 }}>
                    <JsonSchemaEditor
                        value={JSON.stringify(formSchemas.uiSchema, null, 2)}
                        onChange={handleUISchemaChange}
                        onValidationChange={handleUISchemaValidation}
                        label="Form UI Schema"
                        placeholder="Enter UI schema definition for form presentation..."
                        height={400}
                        showValidation={true}
                        formatOnBlur={true}
                    />
                </Paper>
            </TabPanel>

            <TabPanel value={value} index={3}>
                <Typography variant="h6" gutterBottom>
                    Form Preview
                </Typography>
                
                <ValidationStatus 
                    isValid={validationState.schema.isValid && validationState.uiSchema.isValid}
                    errors={[
                        ...(!validationState.schema.isValid ? ['Schema errors present'] : []),
                        ...(!validationState.uiSchema.isValid ? ['UI Schema errors present'] : [])
                    ]}
                    label="Form Preview Status"
                />

                {validationState.schema.isValid && validationState.uiSchema.isValid ? (
                    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Live Form Preview:
                        </Typography>
                        <ReactoryForm 
                            formDef={getFormDefinition('preview')}
                            formData={{}}
                        />
                    </Paper>
                ) : (
                    <Paper elevation={1} sx={{ p: 3, mt: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            Fix schema validation errors to see form preview
                        </Typography>
                    </Paper>
                )}
            </TabPanel>
        </React.Fragment>
    )
}

export default FormEditorEnhanced;
