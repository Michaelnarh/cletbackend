// SEND SMS
const axios = require("axios");

const SendSms = (options) => {
	axios
		.get(
			`https://sms.arkesel.com/sms/api?action=send-sms&api_key=Ok95TGJTSkVIS0t6enFEYjU=&to=${
				options?.phone
			}&from=${options?.from ?? "CLET-GH"}&sms=${options?.message}`
		)
		.then((response) => {
			console.log(response);
			return response;
		})
		.catch((error) => console.log(error));
};

module.exports = SendSms;
