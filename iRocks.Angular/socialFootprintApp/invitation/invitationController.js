(function (app) {

    var invitationController = function ($scope, emailService, translationService, $timeout, $location) {
        var _sendInvitation = function () {
            emailService.sendEmail($scope.friendsEmail, $scope.message).then(function (results) {
                $scope.sendInvitationSuccessfully = true;
                $scope.sendInvitationMessage = $scope.translationService.translations.INVITATION_SENT;
                startTimer();
            }, function (error) {
                $scope.sendInvitationSuccessfully = false;
                $scope.sendInvitationMessage = $scope.translationService.translations.INVITATION_ERROR;
            });
        };
        var startTimer = function () {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('/feed');
            }, 3000);
        }
        $scope.sendInvitationSuccessfully = false;
        $scope.sendInvitationMessage = "";
        $scope.friendsEmail = "";
        $scope.message = "";
        $scope.sendInvitation = _sendInvitation;
        $scope.translationService = translationService;
    };
    app.controller("invitationController", ['$scope', 'emailService', 'translationService', '$timeout', '$location', invitationController]);
}(angular.module("socialFootprintApp")));
