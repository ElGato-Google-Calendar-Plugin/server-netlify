const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const apiResponse = require("../helpers/apiResponse");

const app = express();
const router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version: "v3"});
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

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

router.post("/todayEvents", async(req, res) => {
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
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);


