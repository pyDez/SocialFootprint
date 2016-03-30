(function (app) {



    var zoomInController = function ($scope, $modalInstance, post) {

        $scope.post = post;
       

        $scope.ok = function () {
            if ($scope.post.Post.IsFacebookProvided)
                $modalInstance.close($scope.post.Post.FacebookDetail.Picture);
            if ($scope.post.Post.IsTwitterProvided)
                $modalInstance.close($scope.post.Post.TwitterDetail.Medias[0]);
        };
       
    };
    app.controller("zoomInController", ["$scope", "$modalInstance", "post", zoomInController]);
}(angular.module("socialFootprintApp")));
