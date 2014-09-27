'use strict';
var randomItems;
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function showModalDialog($scope, showModal, $modal,$window, $timeout) {
  if ($scope.counter === (showModal - 1)) {
    var modalInstance = $modal.open({
      templateUrl: '/game/signup',
      controller: 'ModalInstanceCtrl',
      size: 'modal-sm',
      backdrop: 'static'
    });

    modalInstance.result.then(function () {
      $scope.maxItems = randomItems.length;
      $scope.inProgress = false;
      showNextImage($scope, $window, $timeout);
    });
  } else {
    showNextImage($scope, $window, $timeout);
  }
}

function showNextImage($scope, $window, $timeout) {
  $scope.counter++;
  if ($scope.celebItems[randomItems[$scope.counter]]) {

    $scope.showProgress = true;
    var nextImage = function () {
      $scope.celebItem = $scope.celebItems[randomItems[$scope.counter]];
      $scope.inProgress = false;
      // send google analytics the current item's vote
      if ($window.ga) {
        ga('send', 'event', 'voteitem', $scope.celebItem.id, $scope.celebItem.itemTitle, voteValue);
      }
    };
    $timeout(nextImage, 400);
  }
  // no item on the current index
  else {
    $scope.inProgress = false;
    // $window.location.href = '/comingsoon';
  }
}

function retrieveCelebItems($http, $scope) {
  $http.get('/celebItems').
    success(function (data) {
      randomItems = new Array(data.length);
      for (var i = 0; i < randomItems.length; i++) {
        randomItems[i] = i;
      }
      shuffle(randomItems);
      $scope.celebItems = data;
      $scope.counter = 0;
      $scope.celebItem = $scope.celebItems[randomItems[$scope.counter]];
      $scope.showProgress = false;
    })
    .error(function (data) {
      console.log(data);
      $scope.$apply(function () {
        $location.path("/comingsoon");
      });
    });
}

dezboapp.controller('gameCtrl', ['$scope', '$http', '$window', '$timeout', '$modal',
  function ($scope, $http, $window, $timeout, $modal) {
    $scope.counter = 1;
    var showModal = 5;
    $scope.maxItems = showModal;
    $scope.celebItems = [];
    retrieveCelebItems($http, $scope);
    $scope.changeItem = function (voteValue) {
      $scope.inProgress = true;
      var currentItem = $scope.celebItems[randomItems[$scope.counter]];
//      var transform = function (data) {
//        return $.param(data);
//      };
      currentItem.vote = voteValue;
//      $http.post('/voteitem', $scope.celebItems[randomItems[$scope.counter]],
//        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}, transformRequest: transform})
//        .error(function (error){
//          console.log(error);
//        });
      showModalDialog($scope, showModal, $modal,$window, $timeout);
    };
  }
]);
