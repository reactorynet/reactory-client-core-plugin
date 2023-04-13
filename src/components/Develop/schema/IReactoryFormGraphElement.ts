export default (title: string = 'Query Definition') => ({
  type: 'object',
  title,
  properties: {
    name: { type: 'string' },
    text: { type: 'string' },
    resultMap: { type: 'object' },
    resultType: { type: 'string' },
    resultKey: { type: 'string' },
    formData: { type: 'object' },
    variables: { type: 'object' },
    onSuccessMethod: { type: 'string' },
    onSuccessEvent: { type: 'object' },
    mergeStrategy: { type: 'string' },
    mergeFunction: { type: 'string' },
    onError: { type: 'string' },
    options: { type: 'object' },
    throttle: { type: 'number' },
  }
})