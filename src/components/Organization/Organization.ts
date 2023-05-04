import Reactory from '@reactory/reactory-core';

const schema = {
    title: "Organisation",
    type: "object",
    required: ["code", "name", "logo"],
    properties: {
        id: {
            type: "string",
            title: "Organisation Id"
        },
        code: {
            type: "string",
            title: "Short Code"
        },
        name: {
            type: "string",
            title: "Organisation Name",
            maxLength: 255
        },
        logo: {
            type: "string",
            title: "Organisation Logo"
        },
        legacyId: {
            type: "string",
            title: "Legacy Id",
            readonly: true
        },
        createdAt: {
            type: "string",
            title: "Created At",
            format: "date-time"
        },
        updatedAt: {
            type: "string",
            title: "Updated At",
            format: "date-time"
        }
    }
};

const Form = [
    "id",
    { key: "name", placeHolder: "Please provide a name for the organization" },
    { key: "logo", placeHolder: "Please provide a logo for the organization" }
];