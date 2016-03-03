angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Pictures, $cordovaCamera, FramePictures, $cordovaImagePicker, $cordovaCapture, UploadService, $sce) {
document.addEventListener("deviceready", function() {
  $scope.pictures = Pictures;
  $scope.framepictures = FramePictures;
  $scope.pictures_gal = []
  $scope.ideaIndex = 1;

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  function convertImgToBase64URL(url, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL('image/jpeg');
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  }

  $scope.cardStyle = function() {
    return "transform: rotate(" + Math.floor(Math.random() * 7) + "deg)"
  }

  $scope.showOverlay = false;
  $scope.showModal = false;
  $scope.showIdeas = false;

  $scope.openModal = function(pic) {
    $scope.showModal = true;
    $scope.showOverlay = true;
    $scope.showPic = pic
  }

  $scope.hideModel = function() {
    $scope.showModal = false;
    $scope.showOverlay = false;
    $scope.showPic = null;
    $scope.showIdeas = false;
  }

  $scope.onShake = function() {
    $scope.showIdeas = false;
    setTimeout(function() {
      $scope.ideaIndex = Math.floor(Math.random() * (5 - 1 + 1)) + 1;;
      $scope.$apply();
      $scope.showIdeas = true;
    }, 1000)
  }

  $scope.showIdeasModel = function() {
    $scope.showOverlay = true;
    $scope.showIdeas = true;

    shake.startWatch($scope.onShake, 20);

  }

  $scope.hideIdeas = function() {
    $scope.showIdeas = false;
    $scope.showOverlay = false;
  }

  $scope.new_img = {}

  $scope.sendPicture = function(pic) {

    UploadService.uploadMedia(pic).then(
      function(result) {
        var url = result.secure_url || '';
        var new_img = {
          url: url,
          isVideo: pic.isVideo,
          isIdea: pic.isIdea || false,
          time: Date.now(),
          caption: document.querySelector('.input-text')
            .value || null
        }

        $scope.framepictures.$add(new_img)
          .then(function(ref) {
            $scope.hideModel();
            $cordovaCamera.cleanup();
          });


      },
      function(err) {
        $cordovaCamera.cleanup();
      });

  }

  $scope.img_caption = '';

  var options = {
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.CAMERA,
    allowEdit: false,
    encodingType: Camera.EncodingType.JPEG,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: true,
    correctOrientation: false
  };

  var imgoptions = {
    maximumImagesCount: 200,
    width: 800,
    height: 800,
    quality: 20
  };



  $scope.showGallery = function() {

    $cordovaImagePicker.getPictures(imgoptions)
      .then(function(results) {
        for (var i = 0; i < results.length; i++) {
          var imgData = results[i];

          img = {
            url: results[i]
          }

          $scope.pictures_gal.unshift(img)

        }
      }, function(error) {
        // error getting photos
      });

  }

  $scope.uploadVideo = function() {

    var options = { limit: 1, duration: 15 };

    $cordovaCapture.captureVideo(options).then(function(videoData) {
      UploadService.uploadMedia(videoData[0]).then(
        function(result) {
          var url = result.secure_url || '';
          var vid = {
            url: url,
            isVideo: true
          }
          $scope.pictures.$add(vid).then(function(ref) {});
          $scope.showModal = true;
          $scope.showOverlay = true;
          $scope.showPic = vid
          $cordovaCamera.cleanup();
        },
        function(err) {
          $cordovaCamera.cleanup();
        });


    }, function(err) {
      // An error occurred. Show a message to the user
    });


  }

  $scope.takePicture = function(isIdea) {
    $scope.showModal = false;
    $scope.showOverlay = false;
    $scope.showIdeas = false;

    $cordovaCamera.getPicture(options)
      .then(function(imageData) {

        var imageObj = {
          name: "Untitled",
          type: 'image/jpg',
          fullPath: imageData,
          url: imageData,
          isVideo: false
        }

        // $scope.pictures.$add(pic).then(function(ref) {});
        $scope.showModal = true;
        $scope.showOverlay = true;
        $scope.showPic = imageObj;

      }, function(err) {
        // error
      });
  }

}, false);

})

// .controller('ChatsCtrl', function($scope, Chats) {
//   // With the new view caching in Ionic, Controllers are only called
//   // when they are recreated or on app start, instead of every page change.
//   // To listen for when this page is active (for example, to refresh data),
//   // listen for the $ionicView.enter event:
//   //
//   //$scope.$on('$ionicView.enter', function(e) {
//   //});

//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   };
// })

// .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// })

// .controller('AccountCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   };
// });
