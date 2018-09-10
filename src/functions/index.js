var AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {
  var responseBody 
  
  var params = {
    TableName: "reservations"
  };
  
  var dynamodb = new AWS.DynamoDB();
  dynamodb.scan(params, function(err, data) {
     if (err) console.log(err, err.stack) // an error occurred
     else{
       // successful response
        responseBody = data
        var responseCode = "200"
        console.log(responseBody);
        var response = {
              statusCode: responseCode,
              headers: {
                  "Access-Control-Allow-Origin": "*"
              },
              body: JSON.stringify(responseBody)
        };
        callback(null, response)
     }
  })
};