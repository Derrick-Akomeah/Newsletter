// API key
// 7b4884d7cd744294336a9277b77cdb57-us10
// Audience ID - 00e1fea1d9
// Data - {"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"double_optin":false,"marketing_permissions":false}

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var request = require("superagent");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

var mailchimpInstance = "us10",
	listUniqueId = "00e1fea1d9",
	mailchimpApiKey = "7b4884d7cd744294336a9277b77cdb57-us10";

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
	request
		.post(
			"https://" +
				mailchimpInstance +
				".api.mailchimp.com/3.0/lists/" +
				listUniqueId +
				"/members/"
		)
		.set("Content-Type", "application/json;charset=utf-8")
		.set(
			"Authorization",
			"Basic " + new Buffer.from("any:" + mailchimpApiKey).toString("base64")
		)
		.send({
			email_address: req.body.email,
			status: "subscribed",
			merge_fields: {
				FNAME: req.body.firstName,
				LNAME: req.body.lastName,
			},
		})
		.end(function (err, response) {
			if (
				response.status < 300 ||
				(response.status === 400 && response.body.title === "Member Exists")
			) {
				res.sendFile(__dirname + "/success.html");
			} else {
				res.sendFile(__dirname + "/failure.html");
			}
		});
});

app.post("/failure", function (req, res) {
	res.redirect("/");
});

app.listen(process.env.PORT, function () {
	console.log("Example app listening on port 3000!");
});
