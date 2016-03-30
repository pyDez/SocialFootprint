(function (app) {

    var feedController = function ($scope, feedService, $routeParams, footprintTools, $modal, $timeout, translationService, sharedService, notificationService) {



        var _handleResults = function (feed, index, fromCategorization) {
            //cache the org height

            if (!fromCategorization && index == 0 && !$scope.empty) { //on ajoute des posts au dessus du fil, et on ne les affiche pas immédiatement
                $scope.queuedItems = $scope.queuedItems.concat(feed.Results);
                //$scope.feeds = feed.Results.concat($scope.feeds);
                $scope.moreQueue = $scope.queuedItems.length;
            }
            else if (index < 0) {// on ajoute des posts en fin de fil, il seront affiché en scrollant vers le bas

                $scope.waitingFeed = $scope.waitingFeed.concat(feed.Results);
                //$scope.feeds = $scope.feeds.concat(feed.Results);
                $scope.nextPageUrl = feed.NextPageUrl;
            }
            else {
                for (i = 0; i < feed.Results.length; i++) { // on ajoute des posts en millieux de fil.
                    $scope.feeds.splice(index, 0, feed.Results[i]);
                }
            }
            for (j = 0; j < feed.Results.length; j++) {
                $scope.displayedPosts.push(feed.Results[j].FirstPublication.Post.PostId);
                if (feed.Results[j].SecondPublication) {
                    $scope.displayedPosts.push(feed.Results[j].SecondPublication.Post.PostId);
                }
                else {
                    $scope.imcompleteDuels.push({
                        index: index,
                        publication: feed.Results[j].FirstPublication
                    });
                }
                if (feed.Results[j].DuelResult) {

                    feed.Results[j].FirstPublication.Post = footprintTools.initFootprint(feed.Results[j].FirstPublication.Post, feed.Results[j].FirstPublication.User.Footprint);
                    feed.Results[j].SecondPublication.Post = footprintTools.initFootprint(feed.Results[j].SecondPublication.Post, feed.Results[j].SecondPublication.User.Footprint);

                    feed.Results[j].FirstPublication.Post = footprintTools.createFootprint(feed.Results[j].FirstPublication.Post, feed.Results[j].FirstPublication.User.Footprint);
                    feed.Results[j].SecondPublication.Post = footprintTools.createFootprint(feed.Results[j].SecondPublication.Post, feed.Results[j].SecondPublication.User.Footprint);

                    if (feed.Results[j].DuelResult.DownPostId == feed.Results[j].FirstPublication.Post.PostId) {
                        feed.Results[j].FirstPublication.Looser = true;
                        feed.Results[j].isVoted = true;
                    }
                    if (feed.Results[j].DuelResult.DownPostId == feed.Results[j].SecondPublication.Post.PostId) {
                        feed.Results[j].SecondPublication.Looser = true;
                        feed.Results[j].isVoted = true;
                    }
                }
            }
            if ($scope.feeds.length > 0) {
                $scope.empty = false;
            }
            else if ($scope.waitingFeed.length > 0) {
                _addingWaitingPost();
            }
            
            $timeout(function () {
                $scope.dataLoaded = true;
                if ($scope.firstConnexion && index != 0)
                    $scope.dataLoaded = false;
            }, 10);
        };


        if ($routeParams.feedtype == "top") {
            feedService.getUpFeed(false).then(function (results) {
                _handleResults(results, -1, false);

                _updateFeed();

            }, function (error) {
                //alert(error.data.message);
            });
        }
        else if ($routeParams.feedtype == "flop") {
            feedService.getDownFeed(false).then(function (results) {
                _handleResults(results, -1, false);

                _updateFeed();
            }, function (error) {
                //alert(error.data.message);
            });
        }
        else {
            feedService.getFeed(false).then(function (results) {
                _handleResults(results, -1, false);

                _updateFeed();
            }, function (error) {
                //alert(error.data.message);
            });
        }

        var _updateFeed = function () {
            if ($routeParams.feedtype == "top") {

                feedService.getUpFeed(true, $scope.displayedPosts).then(function (results) {
                    _handleResults(results, 0, false);
                    if (results.Results.length > 0) {
                        _updateFeed();
                    }
                }, function (error) {
                    //alert(error.data.message);
                });
            }
            else if ($routeParams.feedtype == "flop") {
                feedService.getDownFeed(true, $scope.displayedPosts).then(function (results) {
                    _handleResults(results, 0, false);
                    if (results.Results.length > 0) {
                        _updateFeed();
                    }
                }, function (error) {
                    //alert(error.data.message);
                });
            }
            else {
                feedService.getFeed(true, $scope.displayedPosts).then(function (results) {
                    _handleResults(results, 0, false);
                    if (results.Results.length > 0) {
                        _updateFeed();
                    }
                }, function (error) {
                    //alert(error.data.message);
                });
            }
        };

        var _vote = function (firstPostId, secondPostId, winnerPostId) {
            var aVote = {
                DownPostId: "",
                UpPostId: ""
            };

            if (winnerPostId == firstPostId) {
                aVote.UpPostId = firstPostId;
                aVote.DownPostId = secondPostId;
            }
            else {
                aVote.UpPostId = secondPostId;
                aVote.DownPostId = firstPostId;
            }

            //var footprintHeight = Math.max.apply(null, $('.footprintContainer').map(function () {
            //    return $(this).height();
            //}).get());
            //if (footprintHeight < 0)
            //{
            //    footprintHeight = 0;
            //}

            //var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            //document.documentElement.scrollTop = document.body.scrollTop = currentScroll + footprintHeight;

            //votedPosts.push(index);
            feedService.vote(aVote).then(function (response) {
                var skills = response.Skills;
                for (i = 0; i < $scope.feeds.length; i++) {
                    if ($scope.feeds[i].FirstPublication.User.AppUserId == skills[0].AppUserId) {
                        var user = $scope.feeds[i].FirstPublication.User;
                        var skill = skills[0];
                        updateSkillLevel(user, skill);
                    }
                    if ($scope.feeds[i].FirstPublication.User.AppUserId == skills[1].AppUserId) {
                        var user = $scope.feeds[i].FirstPublication.User;
                        var skill = skills[1];
                        updateSkillLevel(user, skill);
                    }
                    if ($scope.feeds[i].SecondPublication) {
                        if ($scope.feeds[i].SecondPublication.User.AppUserId == skills[0].AppUserId) {
                            var user = $scope.feeds[i].SecondPublication.User;
                            var skill = skills[0];
                            updateSkillLevel(user, skill);
                        }
                        if ($scope.feeds[i].SecondPublication.User.AppUserId == skills[1].AppUserId) {
                            var user = $scope.feeds[i].SecondPublication.User;
                            var skill = skills[1];
                            updateSkillLevel(user, skill);
                        }
                    }
                }
                $scope.$broadcast('updateFootprints');

                //badge winning mgmt
                if (response.NewNotification) {
                    notificationService.addNotification(response.NewNotification);
                }

            }, function (error) {
                //alert(error.data.message);
            });
            for (i = 0; i < $scope.feeds.length; i++) {
                if ($scope.feeds[i].SecondPublication) {
                    if ($scope.feeds[i].FirstPublication.Post.PostId == aVote.UpPostId) {

                        $scope.feeds[i].FirstPublication.Post.Score += 1;
                    }
                    else if ($scope.feeds[i].FirstPublication.Post.PostId == aVote.DownPostId) {
                        $scope.feeds[i].FirstPublication.Looser = true;
                        $scope.feeds[i].FirstPublication.Post.Score -= 1;
                        $scope.feeds[i].isVoted = true;

                    }
                    if ($scope.feeds[i].SecondPublication) {
                        if ($scope.feeds[i].SecondPublication.Post.PostId == aVote.DownPostId) {

                            $scope.feeds[i].SecondPublication.Looser = true;
                            $scope.feeds[i].SecondPublication.Post.Score -= 1;
                            $scope.feeds[i].isVoted = true;
                        }
                        else if ($scope.feeds[i].SecondPublication.Post.PostId == aVote.UpPostId) {
                            $scope.feeds[i].SecondPublication.Post.Score += 1;

                        }
                    }
                }
            }
        };

        var updateSkillLevel = function (user, newSkill) {
            for (j = 0; j < user.Footprint.length; j++) {
                if (user.Footprint[j].CategoryId == newSkill.CategoryId) {
                    var signe = "";
                    if (user.Footprint[j].SkillLevel < newSkill.SkillLevel) {
                        signe = "+";
                    }
                    user.VoteLabel = newSkill.SkillCategory.Label + ": " + signe + (Math.round((newSkill.SkillLevel - user.Footprint[j].SkillLevel) * 100) / 100);
                    user.Footprint[j].SkillLevel = newSkill.SkillLevel;

                }
            }
        };

        var tempNextPageUrl = "";


        _transferWait = function () {
            $scope.feeds = $scope.queuedItems.concat($scope.feeds);
            $scope.queuedItems = [];
            $scope.moreQueue = 0;
            $("html, body").animate({ scrollTop: 0 }, "slow");
        };


        _tutorialStep = function (stepNb) {
            $scope.tutorial = footprintTools.tutorial;
            if ($scope.tutorial) {
                var modalInstance = $modal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'socialFootprintApp/tutorial/tutorial.html',
                    controller: 'tutorialController',
                    resolve: {
                        stepNb: function () {
                            return stepNb;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    _tutorialStep(++stepNb);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
                $
            }
        };

        _getMorePost = function () {
            if (tempNextPageUrl != $scope.nextPageUrl && $scope.nextPageUrl) {
                tempNextPageUrl = $scope.nextPageUrl;
                feedService.getNext($scope.nextPageUrl, $scope.displayedPosts).then(function (results) {
                    _handleResults(results, -1, false);
                    _addingWaitingPost();
                }, function (error) {
                    //alert(error.data.message);
                });
            }
        }
        _addingWaitingPost = function () {
            var goFurther = 4;
            if ($scope.sharedFromService.currentBreakpoint == 'sm' || $scope.sharedFromService.currentBreakpoint == 'xs')
                goFurther = 2;
            var tmpFeed = $scope.waitingFeed.splice(0, goFurther);
            $scope.feeds = $scope.feeds.concat(tmpFeed);

        }

        _loadMore = function () {
            if ($scope.scrollBusy) return;

            $scope.scrollBusy = true;
            if ($scope.waitingFeed.length > 0) {
                _addingWaitingPost();
                if ($scope.waitingFeed.length < 4) {
                    _getMorePost()
                }
            }
            else {
                _getMorePost();
            }
            $scope.scrollBusy = false;

        };

        $scope.tutorial = footprintTools.tutorial;
         $scope.firstConnexion = footprintTools.tutorial;
        _tutorialStep(1);
        $scope.feeds = [];
        $scope.queuedItems = [];
        votedPosts = [];
        $scope.waitingFeed = [];
        $scope.empty = true;
        $scope.dataLoaded = false;
        $scope.transferWait = _transferWait;
        $scope.displayedPosts = [];
        $scope.imcompleteDuels = [];
        $scope.vote = _vote;
        $scope.isDuel = true;
        $scope.loadMore = _loadMore;
        $scope.scrollBusy = false;
        $scope.handleResults = _handleResults;
        $scope.translationService = translationService;
        $scope.sharedFromService = sharedService;
    };
    app.controller("feedController", ["$scope", 'feedService', '$routeParams', 'footprintTools', '$modal', '$timeout', 'translationService', 'sharedService', 'notificationService', feedController]);
}(angular.module("socialFootprintApp")));

