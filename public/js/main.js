'use strict';
var userId = 'unknown';


var buildArticle = function (imageHtml, text) {
  var imageId = 'img-' + (imageHtml.match("[a-z0-9]+\.(jpg|png|bmp|gif|tif)")[0].split('.')[0]);
  $('.gallery-row').on('click', '#' + imageId, function () {
    alert(imageId);
  });
  return '<div class="4u 12u(mobile)">' +
      '<article class="box style2">' +
      '<div class="image featured">' + imageHtml + '</div>' +
      '<a id="' + imageId + '" class="remove-shadow">' + text + '</a></article></div>';
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
        console.log('cloudinary upload result ', result);
        var galleryHtml = "";
        $('.cloudinary-thumbnails .cloudinary-thumbnail').each(function () {
          var imageHtml = $(this).html();
          galleryHtml += (buildArticle(imageHtml, "Click here to add a caption"))
        });
        $('.gallery-row').html(galleryHtml);
      });
  $('.cloudinary-button').text('Upload your images!');
};

var revealImageUploadButton = function () {
  $('.upload_widget_wrapper').removeClass('hidden');
};

var storeUserData = function (data, callback) {
  console.log('storing user data in DB ', data);
  var resultObject = {_id: 'blahblahblah'};
  superagent
      .post('http://honey-server.apps.dulcetsoftware.com/user')
      .send(data)
      .end(function (err, result) {
        if (err) throw err;
        console.log(result);
        callback(result);
      })

};

var attachFormHandler = function () {
  $('#contact').submit(function (event) {
    event.preventDefault();
    var data = {};
    $("#contact-form").serializeArray().map(function(x){data[x.name] = x.value;});

    storeUserData(data, function (result) {
      console.log('result from insert ',result);
      userId = JSON.parse(result.text);
      attachUploadWidget();
      revealImageUploadButton();
    })
  });


  $('#registration-form-reset').click(function () {
    deleteCloudinaryImages();
    location.reload();
  });
};

$(document).ready(function () {

  //attachUploadWidget();
  attachFormHandler();

});
