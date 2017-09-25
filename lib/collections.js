Websites = new Mongo.Collection("websites");


//set up allowed operations on website collection
Websites.allow({

	// we need to be able to update Websites for ratings.
	update:function(userId, doc){
		if (Meteor.user()){// they are logged in
			return true;
		} else {// user not logged in - do not let them update  (rate) the website.
			return false;
		}
	},

	insert:function(userId, doc){
		if(Meteor.user()){
			return true;
		} else {
			return false;
		}

	},

	remove:function(userId, doc){
		if(Meteor.user()){
			return true;
		} else {
			return false;
		}
	}
	
});
