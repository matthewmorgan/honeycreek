'use strict';

var userId = 'unknown';
var isSubmitting = false;


var updatePhotoCaption = function(imageId, captionText){
  var captionBox = $('.gallery-row').find('#caption-'+imageId);
  captionBox.fadeTo("fast", 0.33);
  var public_id = imageId.split('-')[1],
      tags = [
        'user-'+userId,
        'caption-'+captionText.split(',').join(' ')
      ];

  var paramString = '?public_id='+public_id+'&tags='+encodeURIComponent(tags);

  superagent
  .put('http://honey-server.apps.dulcetsoftware.com/cloudinary/updatecaption'+paramString)
  .end(function (err, result){
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
  data.email=data.email.toLowerCase();
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

var fetchThreeImages = function(callback) {
  console.log('fetching three images');
  superagent
  .get('http://honey-server.apps.dulcetsoftware.com/cloudinary/randomimages/3')
  .end(function(err, result){
        if (err) throw err;
        result = JSON.parse(result.text);
        console.log('result of fetch ',result);
        var imageArray = result.reduce(function(acc, resource){
          acc.push({ url: resource.url, tags: resource.tags });
          return acc;
        }, []);
        callback(imageArray);
      })
};

var hideRegistrationForm = function(){
  $('.fadable').fadeOut();
};

var attachFormHandler = function () {
  $('#form-submit-button').click(function (event) {
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


  //$('#reset').click(function (event) {
  //  event.preventDefault();
  //  document.getElementById('contact-form').reset();
  //});
};


var displayImagesInGallery = function(displayedImageElements, displayedCaptions, imageArray){
  if (imageArray.length<3) return false;
  imageArray.forEach(function(image, index){
    displayOne(displayedImageElements, displayedCaptions, image, index);
  })
  $('.thumbnails').animate({opacity:'1.0'})
};

var displayOne = function(displayedImageElements, displayedCaptions, image, index){
  var caption = image.tags.filter(function(tag){
    return tag.startsWith('caption');
  })[0].substring(8) || "";

  var partials = image.url.split('upload');
  var rightSizeUrl = partials[0]+'upload/c_fill,h_335,w_335'+partials[1];
  var thisElement = $(displayedImageElements[index]);
  thisElement.attr('src',rightSizeUrl);
  var thisCaption = $(displayedCaptions[index]);
  thisCaption.text(caption);
};


$(document).ready(function () {
  attachFormHandler();
  fetchThreeImages(function(result){
    displayImagesInGallery($('.randomimage'),$('.randomcaption'),result);
  })
});
