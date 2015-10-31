'use strict';

var isSubmitting = false;

var attachFormHandler = function () {
  $('#save-results').click(function (event) {
    console.log('storing results');
    event.preventDefault();
    var comments = [];
    $('.comment').each(function(el){
      var messageHtml = $(this).html();
      console.log(messageHtml);
      var comment = {
        _id: el._id,
        //messageApproved: el.
      };
    });


  })
};

$('document').ready(function () {
  attachFormHandler();
});