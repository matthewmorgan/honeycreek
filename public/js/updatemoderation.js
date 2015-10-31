'use strict';

var isSubmitting = false;

var updateComments = function(comments){
  superagent
  .put('http://honey-server.apps.dulcetsoftware.com/comments')
  .send(comments)
  .end(function(err, result){
        if (err) throw err;
        alert('Comments updated.');
      })
}
var attachFormHandler = function () {
  $('#save-results').click(function (event) {
    event.preventDefault();

    var comments = [];
    $('.comment').each(function(){
      var input = $(this).find('input');
      var comment = {
        _id: input.attr('id'),
        messageApproved: input.is(':checked')
      };
      comments.push(comment)
    });
    updateComments(comments);
  })
};

$('document').ready(function () {
  attachFormHandler();
});