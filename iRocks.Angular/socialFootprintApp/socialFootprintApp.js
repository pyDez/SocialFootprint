(function () {
    var app = angular.module("socialFootprintApp", ["LocalStorageModule", "ngRoute", "ngDragDrop", "infinite-scroll", "ngEmbed", "chart.js", "ui.bootstrap", "ngTextTruncate", "slick"]);
    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
        .when("/login", {
            templateUrl: "socialFootprintApp/auth/login/login.html",
            controller: "loginController"
        })
        .when("/signup", {
            templateUrl: "socialFootprintApp/auth/signup/signup.html",
            controller: "signupController"
        })
        .when("/associate", {
            templateUrl: "socialFootprintApp/auth/externalLogin/associate.html",
            controller: "associateController"
        })
        .when("/feed/:feedtype?", {
            templateUrl: "socialFootprintApp/feed/feed.html",
            controller: "feedController"
        })
        .when("/profile/:appuserid?", {
            templateUrl: "socialFootprintApp/profile/profile.html",
            controller: "profileController"
        })
        .when("/post/:postid", {
            templateUrl: "socialFootprintApp/postFocus/postFocus.html",
            controller: "postFocusController"
        })
        .when("/unauthorizedProfile", {
            templateUrl: "socialFootprintApp/profile/unauthorizedProfile.html"
        })
        .when("/invitation", {
            templateUrl: "socialFootprintApp/invitation/invitation.html",
            controller: "invitationController"
        })
        .when("/bug", {
            templateUrl: "socialFootprintApp/bug/bug.html",
            controller: "bugController"
        })
        .otherwise({ redirectTo: "/login" });

        $locationProvider.html5Mode(true);

    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });

    app.filter('trustAsResourceUrl', ['$sce', function ($sce) {
        return function (val) {
            return $sce.trustAsResourceUrl(val);
        };
    }]);


    app.directive('swipeEffect', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

                var el = document.createElement('div');
                var transformProps = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
                var transformProp = support(transformProps);
                var transitionDuration = 'transitionDuration WebkitTransitionDuration MozTransitionDuration OTransitionDuration msTransitionDuration'.split(' ');
                var transitionDurationProp = support(transitionDuration);

                function support(props) {
                    for (var i = 0, l = props.length; i < l; i++) {
                        if (typeof el.style[props[i]] !== "undefined") {
                            return props[i];
                        }
                    }
                };

                var mouse = {
                    start: {}
                };
                var touch = document.ontouchmove !== undefined;
                var viewport = {
                    x: 0,
                    y: -45,
                    el: element[0],
                    move: function (coords) {
                        if (coords) {
                            if (typeof coords.x === "number") this.x = coords.x;
                            if (typeof coords.y === "number") {
                                this.y = coords.y;
                                if (this.y > 10)
                                    this.y = 10;
                                if (this.y < -100)
                                    this.y = -100;
                            }
                        }
                        this.el.style[transformProp] = "translateZ( -100px ) rotateY(" + this.y + "deg)";
                    },
                    finish: function () {
                        if (this.y > -30)
                            this.y = 0;
                        else if (this.y < -60)
                            this.y = -90;
                        else
                            this.y = -45;
                        this.el.style[transformProp] = "translateZ( -100px ) rotateY(" + this.y + "deg)";
                    },
                    reset: function () {
                        this.move({ x: 0, y: -45 });
                    }
                };

                viewport.duration = function () {
                    var d = touch ? 50 : 1000;
                    viewport.el.style[transitionDurationProp] = d + "ms";
                    return d;
                }();

                element.bind('mousedown touchstart', function (evt) {
                    delete mouse.last;
                    if ($(evt.target).is('a, iframe')) {
                        return true;
                    }

                    evt.originalEvent.touches ? evt = evt.originalEvent.touches[0] : null;
                    mouse.start.x = evt.pageX;
                    mouse.start.y = evt.pageY;
                    $(document).bind('mousemove touchmove', function (event) {
                        // Only perform rotation if one touch or mouse (e.g. still scale with pinch and zoom)
                        if (!touch || !(event.originalEvent && event.originalEvent.touches.length > 1)) {
                            // Only perform rotation if scrolling X is larger than scrolling Y
                            var mouseEvt = event;
                            event.originalEvent.touches ? mouseEvt = event.originalEvent.touches[0] : null;
                            if (!touch || Math.abs(mouseEvt.pageY - mouse.start.y) < Math.abs(mouseEvt.pageX - mouse.start.x)) {
                                event.preventDefault();
                                // Get touch co-ords
                                event.originalEvent.touches ? event = event.originalEvent.touches[0] : null;
                                element.trigger('move-viewport', { x: event.pageX, y: event.pageY });
                            }

                        }
                    });
                    element.bind('mouseup touchend', function () {
                        viewport.finish();
                    });
                    $(document).bind('mouseup touchend', function () {
                        $(document).unbind('mousemove touchmove');
                    });
                })
                element.bind('move-viewport', function (evt, movedMouse) {

                    // Reduce movement on touch screens
                    var movementScaleFactor = touch ? 3 : 1;

                    if (!mouse.last) {
                        mouse.last = mouse.start;
                    } else {
                        if (forward(mouse.start.x, mouse.last.x) != forward(mouse.last.x, movedMouse.x)) {
                            mouse.start.x = mouse.last.x;
                        }
                        if (forward(mouse.start.y, mouse.last.y) != forward(mouse.last.y, movedMouse.y)) {
                            mouse.start.y = mouse.last.y;
                        }
                    }

                    viewport.move({
                        x: viewport.x + parseInt((mouse.start.y - movedMouse.y) / movementScaleFactor),
                        y: viewport.y - parseInt((mouse.start.x - movedMouse.x) / movementScaleFactor)
                    });

                    mouse.last.x = movedMouse.x;
                    mouse.last.y = movedMouse.y;

                    function forward(v1, v2) {
                        return v1 >= v2 ? true : false;
                    }
                });

            }
        };
    }]);
    app.directive('duelIcon', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('mouseover', function (e) {
                    $(this).find(".voteDown").css('display', 'none');
                    $(this).closest(".aDuelContainer").find(".voteUp").css('display', 'none');
                    $(this).find(".voteUp").css('display', 'inline-block');
                    $(this).find(".voteUp").css('padding', '0 10px 0 11px');
                })
                element.bind('mouseout', function (e) {
                    $(this).find(".voteDown").css('display', 'inline-block');
                    $(this).closest(".aDuelContainer").find(".voteUp").css('display', 'inline-block');
                    $(this).find(".voteUp").css('padding', '0');
                })
            }
        };
    }]);
    app.directive('centerLoader', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.ready(function () {
                    var containerHeight = $('#footer')[0].offsetTop;
                    element.css('margin-top', (containerHeight / 2 - 40) + 'px');
                });
            }
        };
    }]);
    app.directive('setCubeSizeOnLoad', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.ready(function () {
                    var SetSize = function (element) {
                        $timeout(function () {
                            if (element[0].children[0].children[0].children[0]) {

                                var containerHeight = (element[0].children[0].children[0].children[0].scrollHeight + 14) + 'px';
                                if (element[0].children[0].children[1].scrollHeight > element[0].children[0].children[0].scrollHeight) {
                                    containerHeight = (element[0].children[0].children[1].children[0].scrollHeight + 14) + 'px';
                                }
                                element.css('height', containerHeight);
                                element.css('margin-bottom', element[0].children[0].children[0].scrollWidth / (3) + 'px');
                                element.css('margin-top', element[0].children[0].children[0].scrollWidth / (3) + 'px');
                            }
                        }, 0);

                    };
                    scope.$on('$viewContentLoaded', SetSize(element));

                    $timeout(function () {

                        scope.$watch(function () {
                            scope._heightFigure1 = element.find('.postContainer')[0].scrollHeight;
                            scope._heightFigure2 = element.find('.postContainer')[1].scrollHeight;
                            scope._heightFigure3 = 0;
                            if (element.find('.postContainer')[2])
                                scope._heightFigure3 = element.find('.postContainer')[2].scrollHeight;

                            scope._heightFigure4 = 0;
                            if (element.find('.postContainer')[3])
                                scope._heightFigure4 = element.find('.postContainer')[3].scrollHeight;
                        });

                        scope.$watch('_heightFigure1', function (newHeight, oldHeight) {
                            SetSize(element);

                        });
                        scope.$watch('_heightFigure2', function (newHeight, oldHeight) {
                            SetSize(element);
                        });
                        scope.$watch('_heightFigure3', function (newHeight, oldHeight) {
                            SetSize(element);

                        });
                        scope.$watch('_heightFigure4', function (newHeight, oldHeight) {
                            SetSize(element);

                        });



                    }, 0);
                });
            }
        };
    }]);
    app.directive('setHeaderMargin', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.ready(function () {
                    var SetSize = function (element) {
                        $('#mainContainer').css('margin-top', $('#header').height() + 20 + 'px');
                    };

                    scope.$watch(function () {
                        SetSize(element);
                    });
                });
            }
        };
    }]);
    app.directive('collapseMenu', ['sharedService', function (sharedService) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('click ', function (e) {
                    if (sharedService.currentBreakpoint == 'sm' || sharedService.currentBreakpoint == 'xs') {
                        $(".navbar-toggle").click();//bootstrap 3.x by Richard
                    }
                })


            }
        };
    }]);
    app.directive('tooltip', ['sharedService', function (sharedService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).hover(function () {
                    // on mouseenter
                    if (sharedService.currentBreakpoint != 'sm' && sharedService.currentBreakpoint != 'xs')
                        $(element).tooltip('show');
                }, function () {
                    // on mouseleave
                    if (sharedService.currentBreakpoint != 'sm' && sharedService.currentBreakpoint != 'xs')
                        $(element).tooltip('hide');
                });

                element.bind('click ', function (e) {
                    if (sharedService.currentBreakpoint == 'sm' || sharedService.currentBreakpoint == 'xs') {
                        if ($('.popover.in').length > 0) {
                            if (sharedService.tooltipIdentifier == $(element)[0].innerText) {
                                $('.popover.in').popover('hide');
                            }

                        }
                        $(element).popover('show');
                        sharedService.tooltipIdentifier = $(element)[0].innerText;

                    }
                })


            }
        };
    }]);
    app.directive('tweetDisplay', ['$compile', function ($compile) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                var text = attrs.tdText;
                var splittedTweet = text.split(' ');
                var newText = "";
                for (var i = 0; i < splittedTweet.length; ++i) {
                    var users = scope.$parent.$parent.$parent.$parent.post.Post.TwitterDetail.MentionedUsers;
                    if (splittedTweet[i].indexOf('http://') == 0 || splittedTweet[i].indexOf('https://') == 0) {
                        var parser = document.createElement('a');
                        parser.href = splittedTweet[i];

                        var aElement = document.createElement('a');
                        aElement.setAttribute("ng-click", "openInNewTab('" + splittedTweet[i] + "')");
                        aElement.setAttribute("class", "pointer");
                        
                        var pathName = parser.pathname;
                        if (pathName[0] == '/')
                        {
                            pathName = pathName.substring(1);
                        }
                        if (pathName.length < 6)
                            aElement.appendChild(document.createTextNode(parser.hostname + '/' + pathName));
                        else
                            aElement.appendChild(document.createTextNode(parser.hostname + '/' + pathName.substring(0, 6) + "..."));
                        newText += aElement.outerHTML + " ";
                    }
                    else if (splittedTweet[i].indexOf('@') == 0 && users!=null) {

                        var aElement = document.createElement('a');
                        aElement.href = 'profile/' + users[splittedTweet[i].substring(1)];
                        aElement.appendChild(document.createTextNode(splittedTweet[i]));
                        newText += aElement.outerHTML + " ";
                    }
                    else {
                        newText += splittedTweet[i] + " ";
                    }

                }
                var newHtmlElement = angular.element('<span>' + newText + '</span>');
                element.append(newHtmlElement);
                $compile(element.contents())(scope.$new());
            }
        };
    }]);

    //var serviceBase = 'http://192.168.0.17/Service/';
    //var serviceBase = 'http://localhost/Service/';
    var serviceBase = 'http://socialfootprintapi.azurewebsites.net/';
    app.constant('ngAuthSettings', {
        apiServiceBaseUri: serviceBase,
        clientId: 'ngAuthApp'
    });


    //google Analytics
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-64690667-1', 'auto');
    ga('send', 'pageview');


}());


