(function (app) {



    var votersController = function ($scope, votersService, translationService, $modalInstance, post) {
        $scope.loaded = false;
        $scope.post = post;
        $scope.votersList = [];
        $scope.upCount = 0;
        $scope.downCount = 0;
        votersService.getVoters(post.Post.PostId).then(function (results) {
            $scope.votersList = results.data;

            var tempVoters = $scope.votersList;
            $scope.votersList = [];
            for (i = 0; i < tempVoters.length; i++) {
                var contains = false;
                var direction = "up";
                ++$scope.upCount;
                if (tempVoters[i].Vote.DownPostId == $scope.post.Post.PostId) {
                    direction = "down";
                    ++$scope.downCount;
                    --$scope.upCount;
                }
                for (var j = 0; j < $scope.votersList.length; j++) {
                    if (tempVoters[i].Voter.AppUserId == $scope.votersList[j].Voter.AppUserId && $scope.votersList[j].direction == direction) {
                        contains = true;
                        ++$scope.votersList[j].Count;
                    }
                }
                if (!contains) {
                    $scope.votersList.push(tempVoters[i]);
                    $scope.votersList[$scope.votersList.length - 1].Count = 1;
                    $scope.votersList[$scope.votersList.length - 1].direction = direction;
                }


            }
            $scope.loaded = true;

        }, function (error) {
            $scope.loaded = true;
            //alert(error.data.message);
        });

        $scope.ok = function () {
            $modalInstance.close($scope.post.Post.FacebookDetail.Picture);
        };
        $scope.translationService = translationService;

    };
    app.controller("votersController", ["$scope", "votersService", "translationService", "$modalInstance", "post", votersController]);
}(angular.module("socialFootprintApp")));
