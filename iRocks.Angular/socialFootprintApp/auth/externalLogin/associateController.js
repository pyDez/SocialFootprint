(function () {

    associateController = function ($scope, $rootScope, $location, $timeout, authService, footprintTools, translationService) {

        $scope.savedSuccessfully = false;
        $scope.message = "";

        $scope.registerData = {
            userName: authService.externalAuthData.userName,
            provider: authService.externalAuthData.provider,
            externalAccessToken: authService.externalAuthData.externalAccessToken,
            email: authService.externalAuthData.email
        };

        $scope.registerExternal = function () {

            authService.registerExternal($scope.registerData).then(function (response) {

                $scope.savedSuccessfully = true;
                $scope.message = "User has been registered successfully, you will be redicted to your news feed in 2 seconds.";
                authService.fillAuthData();
                $rootScope.$broadcast('updateFrameWithUserInfo');
                footprintTools.tutorial = true;
                startTimer();

            },
              function (response) {
                  var errors = [];
                  for (var key in response.ModelState) {
                      errors.push(response.ModelState[key]);
                  }
                  $scope.message = "Failed to register user due to: " + errors.join(' ');
              });
        };

        var startTimer = function () {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('/feed');
            }, 2000);
        }
        $scope.translationService = translationService;


    };


    var module = angular.module("socialFootprintApp");
    module.controller("associateController", ['$scope', '$rootScope', '$location', '$timeout', 'authService', 'footprintTools', 'translationService', associateController]);
}());