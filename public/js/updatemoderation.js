function updateComments(comments){
  superagent
  .put('http://honey-server.apps.dulcetsoftware.com/comments')
  .send(comments)
  .end(function(err){
        if (err) throw err;
        alert('Comments updated.');
      })
}

function attachFormHandler() {
  $('#save-results').click(function (event) {
    event.preventDefault();

    var comments = [];
    $('.comment').each(function(){
      var input = $(this).find('input');
      var comment = {
        _id: input.attr('id'),
        messageApproved: input.prop('checked')
      };
      comments.push(comment)
    });
    console.log(comments);
    updateComments(comments);
  })
}

$('document').ready(function () {
  attachFormHandler();
});