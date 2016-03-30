(function (app) {



    var tutorialController = function ($scope, $modalInstance, footprintTools, stepNb, translationService) {
        $scope.stepNb = stepNb;
        $scope.stop = function () {
            footprintTools.tutorial = false;
            $modalInstance.close();
        };
        $scope.ok = function () {
            $modalInstance.close();
        };
        $scope.translationService = translationService;
    };
    app.controller("tutorialController", ["$scope", "$modalInstance", 'footprintTools', 'stepNb', 'translationService', tutorialController]);
}(angular.module("socialFootprintApp")));