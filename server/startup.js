Meteor.startup(function () {
// code to run on server at startup
if (!Websites.findOne()){
	console.log("No links yet. Creating starter data.");

	var sites = [
		{
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
				voted: [
					["GMSITTER", 0]
				],
			}
		],
		rating:2,
		votes: [
			{username:"Snake", rating:1},
			{username:"gmsitter", rating:1}
		]
	},
	{
		title:"Hacker News",
		url:"http://www.google.com",
		description:"Social tech news site",
		createdOn:new Date(),
		comments:[],
		rating:1,
		votes: [
			{username:"gmsitter", rating:1}
		]
	},
	{
		title:"Reddit",
		url:"http://www.reddit.com",
		description:"Some crappy knockoff.",
		createdOn:new Date(),
		comments:[
			{
				commentnumber: Random.id(),
				rating:1,
				user:"GMSITTER",
				content:"test comment",
				date: new Date(),
				voted: [
					["GMSITTER", 0]
				],
			}
		],
		rating:-1,
		votes: [
			{username:"gmsitter", rating:-1}
		]
	},
	{
		title:"New York Times",
		url:"http://www.nytimes.com",
		description:"The paper of record.",
		createdOn:new Date(),
		comments:[
			{
				commentnumber: Random.id(),
				rating:1,
				user:"GMSITTER",
				content:"test comment",
				date: new Date(),
				voted: [
					["GMSITTER", 0]
				],
			}
		],
		rating:0,
		votes: []
	}];

	sites.forEach(function(x){
		Websites.insert(x);
	})
}

});
