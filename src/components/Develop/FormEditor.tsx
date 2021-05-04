
/**
 * {
        id: 'lasec-crm.CertificateOfConformance',
        name: 'CertificateOfConformanceForm',
        nameSpace: 'lasec-crm',
        version: '1.0.0',
        title: 'International Document',
        uiFramework: 'material',
        uiSupport: ['material'],
        helpTopics: [`lasec-help-international-document-${use_case}`],
        backButton: false,
        schema,
        uiSchema,
        widgetMap
    }
 * 
 * 
 * @param props 
 * 
 */

const FormEditor = (props: any) => {
    const { reactory } = props;
    const { utils } = reactory;

    const React: any = reactory.getComponent('react.React');
    const [time, setTime] = React.useState(utils.moment())
    const [schema, setSchema] = React.useState({ type: 'string', title: 'Property 1' });
    const [uiSchema, setUISchema] = React.useState({});


    const  MaterialCore  = reactory.getComponent('material-ui.MaterialCore');
    const ReactoryForm = reactory.getComponent('core.ReactoryForm');

    const formDef = {
        id: '',
        name: '',
        nameSpace: `${reactory.CLIENT_KEY}`,
        version: '1.0.0',
        title: 'Document',
        schema,
        uiSchema
    };
        
    setTimeout(() => {
        setTime(utils.moment())
    }, 500);

    return (
        <React.Fragment>
            <p>Form Editor - {time.format("HH:mm:ss")} </p>            
            <ReactoryForm formDef={ formDef } />
        </React.Fragment>
    )
}

export default FormEditor;