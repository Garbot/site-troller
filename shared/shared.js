//required for comment voting to work properly.
Meteor.methods({
	vote_comment: function (_id, commentnumber, increment) {
    	// Make sure the user is logged in before inserting a task
	    if (! Meteor.userId()) {
	      throw new Meteor.Error("not-authorized");
	    }

	    Websites.update(
	    {
	      _id: _id,
	      "comments.commentnumber" : commentnumber
	    },
	    {
	      $inc: {
	   		"comments.$.rating" : increment
	      }
	    })
	}
});

//EasySearch index.  http://matteodem.github.io/meteor-easy-search/getting-started/
WebsitesIndex = new EasySearch.Index({
  collection: Websites,
  fields: ['title', 'url', 'description'],
  engine: new EasySearch.Minimongo()
});

console.log(Websites)
