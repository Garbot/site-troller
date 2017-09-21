Meteor.startup(function () {
// code to run on server at startup
if (!Websites.findOne()){
	console.log("No links yet. Creating starter data.");

	Websites.insert({
		title:"Google",
		url:"http://www.google.com",
		description:"Popular search engine.",
		createdOn:new Date(),
		comments:[
			{
			commentnumber: Random.id(),
			rating:1,
			user:"GMSITTER",
			content:"test comment",
			date: new Date(),
			voted: ["GMSITTER"],
			}
		],
		rating:1,
		voted: [],
	});
}

});
