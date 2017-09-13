//TODO
// - implement HTTP
// - refactor upvoting/downvoting code into a single reusable function?
// - one vote per person
//		- compile upvotes and downvotes separately
//		- if user is present in upvote, cannot vote again;
//		- if user downvotes, removes from upvote and adds username value to downvote;
//		- compile total upvotes minus total downvotes for rating.
// - better styling
// - infinite scroll
// - security - DONE
// - autocomplete http:// on urls.
// - have search operate based on filter of existing results instead of separate page.
//		- see image_share main.js for example.

//iron:router
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});


Router.route('/', function () {
	this.render('navigation', {
	to: "navigation"
	});

	this.render('website_list', {
	to: "main"
	});

	this.render('website_form', {
	to: "form"
	});
});

Router.route('/site/:_id', function () {
	this.render('navigation', {
	to: "navigation"
	});

	this.render('website_item_detail', {
	to: "main",
	data: function(){
		return Websites.findOne({_id:this.params._id});
	}
	});
});

Router.route('/search', function () {
	this.render('navigation', {
	to: "navigation"
	});

	this.render('website_form', {
	to: "form"
	});
	
	this.render('searchBox', {
	to: "main"
	})
});
//end iron:router

/////
// define methods
/////

//infinite scroll
Session.set("item_limit", 12);  //Session.set is used to store a variable on the local session.

lastScrollTop=0;              //position before scrolling.

$(window).scroll(function(event){
  //test if they are near bottom of window
  if($(window).scrollTop()+ $(window).height() > $(document).height() - 100){
    
    var scrollTop = $(this).scrollTop();  //where are we in the page?
    console.log("test1");
    if(scrollTop>lastScrollTop){          //test if we are going down.
      console.log("test2");
      Session.set("item_limit", Session.get("item_limit") + 4); //load 4 new images when scrolling down.
    }
    lastScrollTop = scrollTop;   //reset scroll position.
  } 
});
//end infinite scroll


/////
// template helpers 
/////

Template.searchBox.helpers({
  websitesIndex: () => WebsitesIndex
});

// helper function that returns all available websites
Template.website_list.helpers({
	websites:function(){
		return Websites.find({}, {sort:{rating:-1}, limit:Session.get("item_limit")});
	}
});

Template.website_item_detail.helpers({
	comments:function(){
		var comment_data = Websites.findOne({_id:Template.currentData()._id}).comments;
		return _.sortBy(comment_data, function(comment){ return -comment.rating });		//underscore command
	}
});

/////
// template events
/////
Template.website_item.events({
	"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		var currPos = $("#"+website_id).index();		
		console.log(currPos);
		console.log("Up voting website with id "+website_id);

		Websites.update(
			{_id:website_id},
			{$inc:{rating:1}}
		);
		if($("#"+website_id).index() != currPos){		//animation transition for the elements being swapped.
    		$("#"+website_id).hide().fadeIn(1000);
    		$("#"+website_id).next().hide().fadeIn(1000);
    	}
		return false;// prevent the button from reloading the page
	}, 

	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		var currPos = $("#"+website_id).index();
		console.log(currPos);
		console.log("Down voting website with id "+website_id);
		Websites.update(
			{_id:website_id},
			{$inc:{rating:-1}}
		);

		if($("#"+website_id).index() != currPos){		//animation transition for the elements being swapped.
    		$("#"+website_id).hide().fadeIn(1000);
    		console.log("test");
    		$("#"+website_id).prev().hide().fadeIn(1000);
    	}
		return false;// prevent the button from reloading the page
	}
});

Template.navigation.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").toggle('slow');
	}
});

Template.website_form.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").toggle('slow');
	}, 

	"submit .js-save-website-form":function(event){

		var url = event.target.url.value;
		var title = event.target.title.value;
		var description = event.target.description.value;

	    if(Meteor.user()){
	      Websites.insert(
	        {
	          url:url,
	          title:title,
	          description:description,
	          createdOn:new Date(),
	          rating:0
	        }
	      );

	    }
		
		$("#website_form").toggle('slow');
		$(".js-save-website-form")[0].reset();
		
		return false;// stop the form submit from reloading the page

	}
});

Template.website_item_detail.events({
	"click .js-toggle-comment-form":function(event){
		$("#comment_form").toggle('slow');
	},

	"submit .js-add-comment-form":function(event){

		var user = Meteor.user().username;
		var content = event.target.comment_box.value;

		//In the database, each website _id has a comments array.  This operation pushes a single new comment
		//object to that "comments" array.
	    if(Meteor.user()){
			Websites.update(
				{_id: this._id},
				{ $push:
					{ comments:
						{
						commentnumber: Random.id(),
						rating:0,
						user:user,
						content:content,
						date:new Date()
						}
					}
				});
		}
	
		$("#comment_form").toggle('slow');
		$(".js-add-comment-form")[0].reset();
	
		return false;// stop the form submit from reloading the page

	},

	"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		var currPos = $("#"+website_id).index();
		console.log(currPos);
		console.log("Up voting website with id "+website_id);

		Websites.update(
			{_id:website_id},
			{$inc:{rating:1}}
		);
		if($("#"+website_id).index() != currPos){		//animation transition for the elements being swapped.
    		$("#"+website_id).hide().fadeIn(1000);
    		$("#"+website_id).next().hide().fadeIn(1000);
    	}
		return false;// prevent the button from reloading the page
	}, 

	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		var currPos = $("#"+website_id).index();
		console.log("Down voting website with id "+website_id);
		Websites.update(
			{_id:website_id},
			{$inc:{rating:-1}}
		);

		if($("#"+website_id).index() != currPos){		//animation transition for the elements being swapped.
    		$("#"+website_id).hide().fadeIn(1000);
    		$("#"+website_id).prev().hide().fadeIn(1000);
    	}
		return false;// prevent the button from reloading the page
	}
});

Template.ind_comment.events({
	"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var currPos = $(event.currentTarget).closest('.list_item').index();		//get index of the li containing the arrow.
		var websiteID = $('.website-item-detail').attr('id');
		var commentID = $(event.currentTarget).closest('.list_item').attr('id');

		console.log(currPos + " - " + commentID + " - " + websiteID);
		
		
		Meteor.call("vote_comment", websiteID, commentID, 1, function(){
			if($("#"+commentID).index() != currPos){		//animation transition for the elements being swapped.
	    		$("#"+commentID).hide().fadeIn(1000);		//passed async to animate properly (see Meteor.call docs)
	    		$("#"+commentID).next().hide().fadeIn(1000);
	    	}
		});		//call meteor method for comment voting
		


		return false;// prevent the button from reloading the page
	}, 

	"click .js-downvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var currPos = $(event.currentTarget).closest('.list_item').index();		//get index of the li containing the arrow.
		var websiteID = $('.website-item-detail').attr('id');
		var commentID = $(event.currentTarget).closest('.list_item').attr('id');

		console.log(currPos + " - " + commentID + " - " + websiteID);
		
		Meteor.call("vote_comment", websiteID, commentID, -1, function(){
			if($("#"+commentID).index() != currPos){		//animation transition for the elements being swapped.
	    		$("#"+commentID).hide().fadeIn(1000);		//passed async to animate properly (see Meteor.call docs)
	    		$("#"+commentID).prev().hide().fadeIn(1000);
	    	}
		});		//call meteor method for comment voting


		return false;// prevent the button from reloading the page
	}
});



/////////
//Animations
////////
Template.website_item.onRendered(function(){
    this.$(".list_item").hide().fadeIn(500);
});

/////
//accounts
/////
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});