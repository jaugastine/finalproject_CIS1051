"use strict";


/* SOME CONSTANTS */
let endpoint01 = "https://yfn1heuoo9.execute-api.us-east-1.amazonaws.com/default/project4augastine";


let activeItemId = "";
let bookLink = ""


/* SUPPORTING FUNCTIONS */


let returnBook = (activeItemId) => {
   // AJAX call to delete item
   console.log(activeItemId)
   $.ajax({
       "url": endpoint01 + "/useritems",
       "method": "POST",
       "data": {itemid: activeItemId},
       "success": (results) => {
           console.log(results); // best practice for students
           $("#div-mylibrary").show();
           $('#div-viewitem2').hide();
           activeItemId = ""; // Reset active item code
           myLibraryList();
       },
       "error": (data) => {
           console.log(data);
           $('#message-mylibrary').html("Unexpected error. Try again.");
           $('#message-mylibrary').addClass("alert alert-danger");
       }
   });
   $("html, body").animate({ scrollTop: "0px" });
};


let rentBook = (activeItemId) => {
   console.log(activeItemId, localStorage.userid);
   let userid = localStorage.userid;
   // AJAX call to delete item
   $.ajax({
       "url": endpoint01 + "/item",
       "method": "POST",
       "data": { userid: userid, itemid: activeItemId },
       "success": (results) => {
           console.log(results); // best practice for students
           $("#div-adminlist").show();
           $('#div-viewitem').hide();
          activeItemId = ""; // Reset active item code
           adminListController();
       },
       "error": (data) => {
           console.log(data);
           $('#message-adminlist').html("Unexpected error. Try again.");
           $('#message-adminlist').addClass("alert alert-danger");
       }
   });
   $("html, body").animate({ scrollTop: "0px" });
};


let viewItemController = (itemid) => {
   console.log(itemid);
   $.ajax({
       "url": endpoint01 + "/item",
       "method": "GET",
       "data": "itemid=" + itemid,
       "success": (results) => {
           console.log(results);  // best practice for students           
          
           const author = results[0]['author'];
           const name = results[0]['name'];
           const description = results[0]['description'];


           $("#div-viewitem").show();
           $("#div-adminlist").hide();
           $("#div-mylibrary").hide();
           $("#author").html(author);
           $("#name").html(name);
           $("#descript").html(description);
          
           activeItemId = itemid;
       },            
       "error": (data) => {
           console.log(data);
           $('#message-adminlist').html("Unexpected error. Try again.");
           $('#message-adminlist').addClass("alert alert-danger");
       }
   })
   $("html, body").animate({ scrollTop: "0px" });
  
}


let viewItemController2 = (itemid) => {


   console.log(itemid);
   $.ajax({
       "url": endpoint01 + "/item",
       "method": "GET",
       "data": "itemid=" + itemid,
       "success": (results) => {
           console.log(results);  // best practice for students           
          
           const author = results[0]['author'];
           const name = results[0]['name'];
           const description = results[0]['description'];


           $("#div-viewitem2").show();
           $("#div-viewitem").hide();
           $("#div-adminlist").hide();
           $("#div-mylibrary").hide();
           $("#author2").html(author);
           $("#name2").html(name);
           $("#descript2").html(description);


           activeItemId = itemid;
           console.log(activeItemId)


           console.log("Making request to Gutendex API...");
           $.ajax({
               "url": `https://gutendex.com/books?search=${encodeURIComponent(name)} ${encodeURIComponent(author)}`,
               "method": "GET",
               "success": (gutendexResults) => {
                   console.log("Gutendex API Results:", gutendexResults);


                   // Check if books were found
                   if (gutendexResults.results && gutendexResults.results.length > 0) {
                       const book = gutendexResults.results[0]; // Get the first matching book
                       console.log("First Matching Book:", book);


                       bookLink = book.formats["text/html"];
                      
                       if (bookLink) {
                           console.log("HTML Format URL:", bookLink);
                           // You can use this URL for further processing (e.g., display, download, etc.)
                       } else {
                           console.log("No 'text/html' format available for this book.");
                       }
                   }
               },
               "error": (error) => {
                   console.error("Error fetching from Gutendex API:", error);
               }
           });
       },            
       "error": (data) => {
           console.log(data);
           $('#message-adminlist').html("Unexpected error. Try again.");
           $('#message-adminlist').addClass("alert alert-danger");
       }
   })
   $("html, body").animate({ scrollTop: "0px" });
  
}


let deleteItemController = (activeItemId) => {
   console.log(activeItemId, localStorage.userid);
   let userid = localStorage.userid;
   // AJAX call to delete item
   $.ajax({
       "url": endpoint01 + "/item",
       "method": "DELETE",
       "data": { itemid: activeItemId, userid: userid },
       "success": (results) => {
           console.log(results); // best practice for students
           $("#div-adminlist").show();
           $('#div-viewitem').hide();
           activeItemId = ""; // Reset active item code
           adminListController();
       },
       "error": (data) => {
           console.log(data);
           $('#message-adminlist').html("Unexpected error. Try again.");
           $('#message-adminlist').addClass("alert alert-danger");
       }
   });
   $("html, body").animate({ scrollTop: "0px" });
};
   
let additemController = () =>{
   let name = $("#name-f").val();
   let author = $("#author-f").val();
   let description = $("#descript-f").val();
   let bookcover = $("#bookcover-f").val();


   if(name == undefined || name == ''){
       $('#message-additem').html("Add the Name of the Item.");
       $('#message-additem').addClass("alert alert-danger");
       return;
   };


   if(author == undefined || author == ''){
       $('#message-additem').html("Add the Name of the Item.");
       $('#message-additem').addClass("alert alert-danger");
       return;
   };


   if(description == undefined || description == ''){
       $('#message-additem').html("Add a Description of the Item.");
       $('#message-additem').addClass("alert alert-danger");
       return;
   }; 


   if(bookcover == undefined || bookcover == ''){
       $('#message-additem').html("Add the Numerical Value of the Item.");
       $('#message-additem').addClass("alert alert-danger");
       return;
   }; 
  
   let the_serialized_data = $("#additem-form").serialize();
   console.log(the_serialized_data); //best practice for students


   $.ajax({
       "url": endpoint01 + "/additem",
       "method": "POST",
       "data" : the_serialized_data,
       "success": (results) => {
           console.log(results);  // best practice for students
           var newitemid = results[0]["itemid"];
           $("#addeditemSuccessTitle").html("Added Item " + newitemid);
           $("#div-additem").hide();
           $("#div-additemsuccess").show();
           document.getElementById("additem-form").reset();
       },
       "error": (data) => {
           console.log(data);
           $('#message-additem').html("Unexpected error. Try again.");
           $('#message-additem').addClass("alert alert-danger");
       }
   })
}


let adminListController = () => {
   //clear any previous table data
  
   $('#table-clients').html("<tr> <th>Client Name</th>  <th>Options</th>  </tr>");
   $("#table-items").html("<tr> </tr>");
   //clear any previous messages
   $('#message-adminlist').html("");
   $('#message-adminlist').removeClass();


   // there is no data to error trap here. Step not needed.


   // there is no data to serialize here. Step not needed.


   // next thing to do is to write an ajax call
   $.ajax({
       "url": endpoint01 + "/items",
       "method": "GET",
       "data": "available=Y",
       "success": (results) => {
           console.log(results); // Log results for debugging
           let rowContent = "";
           for (let i = 0; i < results.length; i++) {
               let itemid = results[i]['itemid'];
               let bookcover = results[i]['bookcover'];
               let name = results[i]['name']
               // Append a button for each item
               rowContent += `<button onclick="viewItemController(${itemid})" class="book-cover-button">
                               <img src="${bookcover}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover; border: none;">
                               </button>`;


               // Add a row after every 5 buttons
               if ((i + 1) % 7 === 0 || i === results.length - 1) {
                   $('#table-items').append(`<tr><td colspan="2">${rowContent}</td></tr>`);
                   rowContent = ""; // Clear for the next row
               }
           }
       },
       "error": (data) => {
           console.log(data);
           $('#message-adminlist').html("Unexpected error. Try again.");
           $('#message-adminlist').addClass("alert alert-danger");
       }
   });
  
}


let myLibraryList = () => {
   //clear any previous table data
   let userid = localStorage.userid;
   $("#table-mylibrary").html("<tr> </tr>");
   //clear any previous messages
   $('#message-mylibrary').html("");
   $('#message-mylibrary').removeClass();


   // there is no data to error trap here. Step not needed.


   // there is no data to serialize here. Step not needed.


   // next thing to do is to write an ajax call
   $.ajax({
       "url": endpoint01 + "/useritems",
       "method": "GET",
       "data": "userid=" + userid,
       "success": (results) => {
           console.log(results); // Log results for debugging
           let rowContent = "";
           for (let i = 0; i < results.length; i++) {
               let itemid = results[i]['itemid'];
               let bookcover = results[i]['bookcover'];
               let name = results[i]['name']
               console.log(bookcover)
               // Append a button for each item
               rowContent += `<button onclick="viewItemController2(${itemid})" class="book-cover-button">
                               <img src="${bookcover}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover; border: none;">
                               </button>`;


               // Add a row after every 5 buttons
               if ((i + 1) % 5 === 0 || i === results.length - 1) {
                   $('#table-mylibrary').append(`<tr><td colspan="2">${rowContent}</td></tr>`);
                   rowContent = ""; // Clear for the next row
               }
           }
       },
       "error": (data) => {
           console.log(data);
           $('#message-mylibrary').html("Unexpected error. Try again.");
           $('#message-mylibrary').addClass("alert alert-danger");
       }
   });
}


let loginController = () => {
  
	//clear any previous messages
	$('#message-login').html("");
	$('#message-login').removeClass();
 
 
	//first, let's do some client-side
	//error trapping.
	let username = $("#username").val();
	let password = $("#password").val();
	if (username == "" || password == ""){
		$('#message-login').html('The user name and password are both required.');
		$('#message-login').addClass("alert alert-danger text-center");
		return; //quit the function now!  
	}
   
	let the_serialized_data = $("#form-login").serialize();
	console.log(the_serialized_data); //best practice for students
 
 
	$.ajax({
		"url": endpoint01 + "/auth",
		"data": the_serialized_data,
		"method": "POST",
		"success": (results)=>{
			// best practice for students
			console.log(results);
			if (results.length > 0){
				// what happens when the login is good
				localStorage.userid = results[0]["userid"]; // joe has a userid of 1
			   
 
 
				//manage the appearence of things...
				$('#message-login').html('');
				$('#message-login').removeClass();
				$('.secured').removeClass('locked');
				$('.secured').addClass('unlocked');
				$('.content-wrapper').hide(); //hide all content
				$('#div-menu').show();
			   
				if (results[0]["admin"] == "Y") {
					console.log("User is an admin");
					$('#link-add').show(); // Show "Add Book" navbar link
					$('#button-additem').show();
					$('#link-mylibrary').hide();
					$('#button-mylibrary').hide();
					$('#button-rent').hide();
					$('#button-deleteiteminfo').show();
				} else {
					console.log("User is not an admin");
					$('#link-add').hide(); // Hide "Add Book" navbar link
					$('#button-additem').hide();
					$('#link-mylibrary').show();
					$('#button-mylibrary').show();
					$('#button-rent').show();
					$('#button-deleteiteminfo').hide(); // Hide the "Add Item" div for non-admins
				}
 
 
			} else {
				// what happens when the login is bad
				localStorage.removeItem("userid");
				$('#message-login').html("Login Failed. Try again.");
				$('#message-login').addClass("alert alert-danger text-center");
			}  
		},
		"error": (data)=>{
			// what happens when there is an unexpected error
			localStorage.removeItem("userid");
			$('#message-login').html("Unexpected Error. Try again.");
			$('#message-login').addClass("alert alert-danger text-center");
		}
	});
 
 
	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
 };
 




//document ready section
$(document).ready(() => {


  /* ----------------- force this page to be https ------- */
  let loc = window.location.href+'';
  if (loc.indexOf('http://')==0){
      window.location.href = loc.replace('http://','https://');
  }


   /* ------------------  basic navigation ----------------*/




   /* ----------------- start up navigation -----------------*/   
   /* controls what gets revealed when the page is ready     */
   if (localStorage.userid){
       //console.log("here i am !")
       $("#div-menu").show()
       $(".secured").removeClass("locked");       
       $(".secured").addClass("unlocked");
       $("#scanuserid").val(localStorage.userid);
       $('html, body').animate({scrollTop: "0px"});
   }
   else {
       $("#div-login").show();
       $(".secured").removeClass("unlocked");
       $(".secured").addClass("locked");
       $('html, body').animate({scrollTop: "0px"});
   }


   // click event handlers


   /* what happens if the view items button is clicked? */
   $('#link-home').click( ()=>{
       $("#div-items").hide();
       $(".content-wrapper").hide();
       $("#div-additem").hide();
       $("#div-menu").show();
       $("#div-adminlist").hide();
       $('html, body').animate({scrollTop: "0px"});
   } );

   $('#link-view').click( ()=>{
		$("#div-items").hide();
		$(".content-wrapper").hide();
		$("#div-additem").hide();
		$("#div-menu").hide();
		$("#div-adminlist").show();
		adminListController();
		$('html, body').animate({scrollTop: "0px"});
	} );

   /* what happens if the additem button is clicked? */
   $('#link-add').click( () => {
       document.getElementById("additem-form").reset();
       $("#div-items").hide();
       $("#div-menu").hide();
       $("#div-adminlist").hide();
       $(".content-wrapper").hide();
       $("#div-additem").show();
       $('html, body').animate({scrollTop: "0px"});
       $('#message-additem').html("");
       $('#message-additem').removeClass();
   });


   $('#link-mylibrary').click( ()=>{
       $("#div-items").hide();
       $(".content-wrapper").hide();
       $("#div-additem").hide();
       $("#div-menu").hide();
       $("#div-adminlist").hide();
       $("#div-mylibrary").show();
       myLibraryList();
       $('html, body').animate({scrollTop: "0px"});
   } );
  
   /* what happens if the login button is clicked? */
   $('#button-login').click( () => {
       loginController();
   });


   $("#link-items").click(()=>{
       $("#div-additem").hide();
       $("#div-menu").hide();
       $("#div-adminlist").hide();
       $(".content-wrapper").hide();
       $("#div-items").show();
       //scroll to top of page
       $("html, body").animate({ scrollTop: "0px" });
   });


   //  logout link here. logout means wipe out
   // the local storage variable and reload the page
   $('#link-logout').click( () => {
       localStorage.removeItem("userid");
       window.location = 'index.html';
       $('#div-menu').hide();
       $('#div-login').show();
       $('#link-add').hide(); // Hide "Add Book" link
       $('#button-additem').hide();
       $('#button-mylibrary').hide()
   });


   //  when navbar links are clicked automatically close the menu
   $('.navbar-nav .nav-link').click( () => {
       $('.navbar-collapse').collapse('hide'); // Collapse the navbar
   });


  
   // Menu buttons to work
   $('#button-additem').click ( () => {
       $("#div-menu").hide();
       $("#div-additem").show();
       $('#message-additem').html("");
       $('#message-additem').removeClass();
   })


   $('#button-adminlist').click ( () => {
       $("#div-menu").hide();
       $("#div-adminlist").show();
       adminListController();
   })






   $('#button-logout').click ( () => {
       localStorage.removeItem("userid");
       window.location = 'index.html';
       $('#div-menu').hide();
       $('#div-login').show();
       $('#link-add').hide(); // Hide "Add Book" link
       $('#button-additem').hide();
       $('#button-mylibrary').hide()
   })




   /* STUDENT WORK HERE */


   $('#button-addnewitem').click( () => {
       additemController();
   });


   $('#button-additemback').click( () => {
       $("#div-additem").hide();
       $("#div-menu").show();
       document.getElementById("additem-form").reset();
   });


   $('#button-addanotheritem').click( () => {
       $("#div-additemsuccess").hide();
       $("#div-additem").show();
       $('#message-additem').html("");
       $('#message-additem').removeClass();
       document.getElementById("additem-form").reset();
   });


   $('#button-additemmenu').click( () => {
       $("#div-additemsuccess").hide();
       $("#div-menu").show();
   });


   $("#button-viewitem").click( () => {
       viewItemController();
       $("#div-adminlist").hide();
       $("#div-viewitem").show();
       $("#div-mylibrary").hide();
      
   })


   $("#button-read").click( () => {
       window.open(bookLink, "_blank")
   })


   $('#button-back2').click( () => {
       $("#div-viewitem2").hide();
       $("#div-mylibrary").show();
       myLibraryList();
   })


   $('#button-returnbook').click( () => {
       returnBook(activeItemId)
       $("#div-viewitem2").hide();
       $("#div-mylibrary").show();
   })


   $("#button-mylibrary").click( () => {
       myLibraryList();
       $("#div-menu").hide();
       $("#div-mylibrary").show();
      
   })


   $('#button-back').click( () => {
       $("#div-viewitem").hide();
       $("#div-adminlist").show();
       adminListController();
   })




   $('#button-deleteiteminfo').click ( (e) => {
       deleteItemController(activeItemId);
       console.log("activeItemCode: ", activeItemId);
      
       $("#div-viewitem").hide();
       $("#div-adminlist").show();
      
       //$(`.table-row-item[data-item-code="${activeItemCode}"]`).remove();
   })


   $('#button-rent').click ( (e) => {
       rentBook(activeItemId);
       console.log("activeItemCode: ", activeItemId);
      
       $("#div-viewitem").hide();
       $("#div-adminlist").show();
      
       //$(`.table-row-item[data-item-code="${activeItemCode}"]`).remove();
   })


}); /* end the document ready event*/
