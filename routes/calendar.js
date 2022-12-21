
const { google } = require('googleapis');
const apiResponse = require("../helpers/apiResponse");

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version: "v3"});

const TIMEOFFSET = '+05:30';

const getEvents = async (params, {credentials, calendarId}) => {
    try {
        const auth = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            SCOPES
        );


        const response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            ...params
            // timeZone: ''
        });
        return response['data']['items'];
    } catch (error) {
        console.log('Get events error', error);
        // return res.status(200).json(error);
    }
}


exports.getTodayEvents = [
	async function (req, res) {
        try {
            const events = await getEvents({
                singleEvents: true,
                orderBy: 'startTime'
            }, req.body);
            return apiResponse.successResponseWithData(res, "Operation success", events);
        } catch (error) {
            console.log(error);
			return apiResponse.ErrorResponse(res, err);
        }
	}
];

exports.getAllEvents = [
	async function (req, res) {
        const dateTimeStart = '2022-01-01T00:00:00.000Z';
        const dateTimeEnd = '2022-12-12T00:00:00.000Z';
        try {
            const events = await getEvents({
                timeMin: dateTimeStart,
                timeMax: dateTimeEnd
            }, req.body);
            return apiResponse.successResponseWithData(res, "Operation success", events);
        } catch (error) {
            console.log(error);
			return apiResponse.ErrorResponse(res, err);
        }
	}
];