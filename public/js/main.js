'use strict';

var userId = 'unknown';
var isSubmitting = false;


var updatePhotoCaption = function(imageId, captionText){
  let captionBox = $('.gallery-row').find('#caption-'+imageId);
  captionBox.fadeTo("fast", 0.33);
  let public_id = imageId.split('-')[1],
      tags = [
        'user-'+userId,
        'caption-'+captionText
      ];

  let paramString = '?public_id='+public_id+'&tags='+encodeURIComponent(tags);

  superagent
  .put('http://honey-server.apps.dulcetsoftware.com/cloudinary/updatecaption'+paramString)
  .end((err, result) => {
        if (err) throw err;
        captionBox.fadeTo("fast", 1.0);
      })
};


var buildArticle = function (imageHtml, text) {
  var imageId = 'img-' + (imageHtml.match("[a-z0-9]+\.(jpg|png|bmp|gif|tif)")[0].split('.')[0]);
  $('.gallery-row').on('change', '#caption-' + imageId, function () {
    var captionText=$('#caption-'+imageId).val().trim();
    updatePhotoCaption(imageId, captionText);
  });
  return '<div class="4u 12u(mobile)">' +
      '<article class="box style2">' +
      '<div class="image featured">' + imageHtml + '</div>' +
      '<textarea id="caption-' + imageId + '" style="resize:vertical" placeholder="add a caption!"></textarea></article></div>';
};

var attachUploadWidget = function () {
  $('#upload_widget_opener').cloudinary_upload_widget(
      {
        cloud_name:               'hztzss4vs', upload_preset: 'dz49gmc6',
        sources:                  ['local', 'url'], multiple: true,
        thumbnails:               '#dummy_thumbnail_gallery',
        thumbnail_transformation: {width: 383, height: 383, crop: 'fill'},
        tags:                     'user-' + userId
      },
      function (error, result) {
        var galleryHtml = "";
        $('.cloudinary-thumbnails .cloudinary-thumbnail').each(function () {
          var imageHtml = $(this).html();
          galleryHtml += (buildArticle(imageHtml, "Add a caption here!"))
        });
        $('.gallery-row').html(galleryHtml);
        $('#photomessage').text("Thanks for sharing your photos!");
        $('.cloudinary-button').text('Upload more images!');
      });
  $('.cloudinary-button').text('Upload your images!');
};

var revealImageUploadButton = function () {
  $('.upload_widget_wrapper').removeClass('hidden');
};

var validateFormData = function(){
  return true;
};

var storeUserData = function (data, callback) {
  superagent
      .post('http://honey-server.apps.dulcetsoftware.com/user')
      .send(data)
      .end(function (err, result) {
        if (err) {
          alert('There was an error storing your information!');
          throw err;
        };
        callback(result);
      })

};

var hideRegistrationForm = function(){
  $('.fadable').fadeOut();
};

var attachFormHandler = function () {
  $('#contact').submit(function (event) {
    event.stopPropagation();
    event.preventDefault();
    if (!isSubmitting && validateFormData()){
      var data = {};
      $("#contact-form").serializeArray().map(function(x){data[x.name] = x.value;});

      storeUserData(data, function (result) {
        userId = JSON.parse(result.text).value._id;
        attachUploadWidget();
        hideRegistrationForm();
        revealImageUploadButton();
        isSubmitting=false;
      })
    }
  });


  $('#registration-form-reset').click(function () {
    deleteCloudinaryImages();
    location.reload();
  });
};

$(document).ready(function () {

  attachFormHandler();

});
