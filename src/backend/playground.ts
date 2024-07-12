import { DynamoDB } from "@aws-sdk/client-dynamodb";
const region = "ap-northeast-2";
const client = new DynamoDB({ region });

const params = {
	TableName: 'scoreweather-dynamo',
	Item: {
		timekey: {
			"N": "2002053012"
		},
		sortkey: {
			"S": "test#2"
		},
		weather: {
			"S": `{"test1":"good", "test2":"bad"}`
		}
	}
};

client.putItem(params).then(
	function(data) {
		console.log("Success", data);
	}
).catch(
	function(err) {
		console.error(err, err.stack);
	}
);