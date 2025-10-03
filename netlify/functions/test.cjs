exports.handler = async (event, context) => {
  console.log('Test function called');
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Test function is working!',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      path: event.path
    })
  };
};
