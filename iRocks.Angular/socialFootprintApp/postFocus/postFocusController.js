(function (app) {

    var postFocusController = function ($scope, postFocusService, $routeParams) {

        postFocusService.getPublication($routeParams.postid).then(function (result) {

            $scope.post = result.data;
        }, function (error) {
        });
        $scope.isDuel = false;

    };
    app.controller("postFocusController", ['$scope', 'postFocusService', '$routeParams', postFocusController]);
}(angular.module("socialFootprintApp")));

