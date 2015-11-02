var userId = 'unknown';
var isSubmitting = false;
var serverAddress = 'http://honey-server.apps.dulcetsoftware.com';
//var serverAddress = 'http://localhost:4000';

var updatePhotoCaption = function (imageId, captionText) {
  var captionBox = $('.gallery-row').find('#caption-' + imageId);
  captionBox.fadeTo("fast", 0.33);
  var public_id = imageId.split('-')[1],
      tags = [
        'user-' + userId,
        'caption-' + captionText.split(',').join(' ')
      ];

  var paramString = '?public_id=' + public_id + '&tags=' + encodeURIComponent(tags);

  superagent
      .put(serverAddress + '/cloudinary/updatecaption' + paramString)
      .end(function (err) {
        if (err) throw err;
        captionBox.fadeTo("fast", 1.0);
      })
};


var buildArticle = function (imageHtml) {
  var imageId = 'img-' + (imageHtml.match("[a-z0-9]+\.(jpg|png|bmp|gif|tif)")[0].split('.')[0]);
  $('.gallery-row').on('change', '#caption-' + imageId, function () {
    var captionText = $('#caption-' + imageId).val().trim();
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
        cloud_name:               'hztzss4vs',
        upload_preset:            'dz49gmc6',
        sources:                  ['local', 'url'],
        cropping:                 'server',
        thumbnails:               '#dummy_thumbnail_gallery',
        thumbnail_transformation: {width: 383, height: 383, crop: 'fill'},
        tags:                     'user-' + userId
      },
      function (err) {
        if (err) throw err;
        var galleryHtml = "";
        $('.cloudinary-thumbnails .cloudinary-thumbnail').each(function () {
          var imageHtml = $(this).html();
          galleryHtml += (buildArticle(imageHtml))
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

var validateFormData = function () {
  var form = $('#contact-form');
  var name = form.find('#name').val().trim();
  var nameFilledOut = name.match('[a-zA-Z]+');  //Safari 7 doesn't like w regex!
  var email = form.find('#email').val().trim();
  var validEmail = validateEmail(email);
  return (nameFilledOut && validEmail);
};

var validateEmail = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
var storeUserData = function (data, callback) {
  data.email = data.email.toLowerCase();
  data.affiliation = $('select').val() || data.otheraffiliation;
  superagent
      .post(serverAddress + '/user')
      .send(data)
      .end(function (err, result) {
        if (err) {
          alert('There was an error storing your information!');
          throw err;
        }
        callback(result);
      })

};

var fetchThreeImages = function (callback) {
  superagent
      .get(serverAddress + '/cloudinary/randomimages/3')
      .end(function (err, result) {
        if (err) throw err;
        result = JSON.parse(result.text);
        var imageArray = result.reduce(function (acc, resource) {
          acc.push({url: resource.url, tags: resource.tags});
          return acc;
        }, []);
        callback(imageArray);
      })
};

var fetchAComment = function (displayComment) {
  superagent
      .get(serverAddress + '/comment/random')
      .end(function (err, result) {
        if (err) throw err;
        result = result.text;
        displayComment(result);
      })
};


var hideRegistrationForm = function () {
  $('.fadable').fadeOut();
};

var attachFormHandler = function () {
  $('#form-submit-button').click(function (event) {
        event.preventDefault();
        if (!isSubmitting) {
          if (validateFormData()) {
            var data = $("#contact-form").serializeArray().reduce(function (acc, x) {
              acc[x.name] = x.value;
              return acc;
            }, {});

            storeUserData(data, function (result) {
              userId = JSON.parse(result.text).value._id;
              attachUploadWidget();
              hideRegistrationForm();
              revealImageUploadButton();
              isSubmitting = false;
            })
          } else {
            alert('Please enter your name and a valid email!');
          }
        }
      }
  );
};


var displayImagesInGallery = function (displayedImageElements, displayedCaptions, imageArray) {
  if (imageArray.length < 3) return false;
  imageArray.forEach(function (image, index) {
    displayOne(displayedImageElements, displayedCaptions, image, index);
  });
  $('.thumbnails').fadeTo("fast", 1.0);
};

var displayOne = function (displayedImageElements, displayedCaptions, image, index) {
  var caption = image.tags.filter(function (tag) {
        return tag.substring(0, 7) === 'caption';
      })[0].substring(8) || "";

  var partials = image.url.split('upload');
  var rightSizeUrl = partials[0] + 'upload/c_fill,h_335,w_335' + partials[1];
  $(displayedImageElements[index]).attr('src', rightSizeUrl);
  $(displayedCaptions[index]).text(caption)
};

var setCommentTimer = function () {
  setInterval(function () {
    fetchAComment(function (comment) {
      if (comment !== $('#current-comment').text()) {
        $('#current-comment').fadeOut('slow', function () {
          $('#current-comment').text(comment);
          $('#current-comment').fadeIn('fast');
        });
      }
    });
  }, 4000);
};

$(document).ready(function () {
  $('html').fadeTo("slow", 1.0);

  attachFormHandler();
  fetchThreeImages(function (randomImages) {
    var imagePlaceholders = $('.randomimage');
    var captionPlaceholders = $('.randomcaption');
    displayImagesInGallery(imagePlaceholders, captionPlaceholders, randomImages);
  })
  fetchAComment(function (comment) {
    $('#current-comment').text(comment);
    setCommentTimer();
  });
});
