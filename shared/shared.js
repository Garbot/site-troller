//required for comment voting to work properly - not allowed via client
//so has to be done via methods.
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
	},

	vote_website: function (website_id, user, increment) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		var voted = Websites.findOne({_id: website_id, 'votes.username': user})

		if (!voted){
			//if user didn't vote yet, add their rating.
			Websites.update(
				{
					_id:website_id
				},
				{
					$inc:{rating: increment},
					$addToSet:{votes:{username: user, rating: increment}}
				}
			);
		} else {

			//check if user already downvoted
			var siteVotes = voted.votes.filter(function(x){
				if(x.username == user){
					return true;
				}
			});

			console.log(siteVotes);
			if((siteVotes[0].rating < 0 && increment < 0) || (siteVotes[0].rating > 0 && increment > 0)){
				//if user already voted, don't allow another vote
				console.log("already voted");
			} else {
				console.log("rollin")
				//otherwise, increment downwards -1
				Websites.update(
					{
						_id:website_id,
						"votes.username": user
					},
					{
						$inc:{rating: increment},
						$inc:{"votes.$.rating": increment}
					}
				);
				Websites.update(
					{
						_id:website_id,
					},
					{
						$inc:{rating: increment}
					}
				);
			}
		}
	}
});

//EasySearch index.  http://matteodem.github.io/meteor-easy-search/getting-started/
WebsitesIndex = new EasySearch.Index({
  collection: Websites,
  fields: ['title', 'url', 'description'],
  engine: new EasySearch.Minimongo()
});

console.log(Websites)
