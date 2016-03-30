(function (app) {

    var bugController = function ($scope, emailService, translationService, $timeout, $location, authService) {
        var _sendSatisfaction = function () {

            var userName = authService.authentication.email;

            var message = '\nNouvelle enquete de satisfaction ! '
            if (userName == "")
                message += '\nFormulaire soumis par un utilisateur non loggé'
            else
                message += '\nFormulaire soumis par ' + userName;
           
            message += '\n\nAppareil utilisé : ' + $scope.device;
            message += '\nPlateforme utilisé ' + $scope.format;
            message += '\nAvis global (/4) : ' + $scope.globalRate;
            message += '\nAvis sur les couleurs (/4) : ' + $scope.colorRate;
            message += '\nCouleur préféré : ' + $scope.color;
            message += '\nAvis sur le systéme de duel (/4) : ' + $scope.duelRate;
            message += '\nConseil pour le systéme de duel : ' + $scope.duelMessage;

            message += '\nAvis sur les votes (/4) : ' + $scope.voteRate;
            message += '\nConseil pour les votes : ' + $scope.voteMessage;
            message += '\nAvis sur l\'empreinte (/4) : ' + $scope.footprintRate;
            message += '\nConseil pour l\'empreinte : ' + $scope.footprintMessage;
            message += '\nAvis sur la vitesse (/4) : ' + $scope.speedRate;
            message += '\nConseil pour la vitesse : ' + $scope.speedMessage;

            message += '\nFonctionnalité bizare ou inutile : ' + $scope.weirdFunction;
            message += '\nFonctionnalité manquante : ' + $scope.missingFunction;
            message += '\problème ou bug : ' + $scope.bug;
            message += '\nAméliorations possibles : ' + $scope.makeItBetter;
            message += '\nUtilisation quotidienne : ' + $scope.dailyUse;
            message += '\nUilisation à la place de Facebook : ' + $scope.betterThanFB;

            
            emailService.sendBugReport( message).then(function (results) {
                $scope.sendSatisfactionFormSuccessfully = true;
                $scope.sendSatisfactionFormMessage = $scope.translationService.translations.SATISFACTION_FORM_SENT;
                startTimer();
            }, function (error) {
                $scope.sendSatisfactionFormSuccessfully = false;
                $scope.sendSatisfactionFormMessage = $scope.translationService.translations.SATISFACTION_FORM_ERROR;
            });
        };

        var _sendBug = function () {
            var userName = authService.authentication.email;
            
            var message = '\nNouveau rapport de bug !';
            if (userName == "")
                message += '\nFormulaire soumis par un utilisateur non loggé'
            else
                message += '\nFormulaire soumis par ' + userName;
            message += '\n\nPage mise en cause : ' + $scope.bugPlace;
            message += '\nDescription du probleme : ' + $scope.bugDescription;
            emailService.sendBugReport(message).then(function (results) {
                $scope.sendBugFormSuccessfully = true;
                $scope.sendBugFormMessage = $scope.translationService.translations.SATISFACTION_FORM_SENT;
                startTimer()
            }, function (error) {
                $scope.sendBugFormSuccessfully = false;
                $scope.sendBugFormMessage = $scope.translationService.translations.SATISFACTION_FORM_ERROR;
                
            });
        };


        var startTimer = function () {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('/feed');
            }, 3000);
        }

        var _showFullForm = function () {
            $scope.fullForm = !$scope.fullForm;
        };
       

        $scope.bugPlace = "";
        $scope.bugDescription = "";
        $scope.device = "";
        $scope.format = "";
        $scope.color = "";
        $scope.duelMessage = "";
        $scope.voteMessage = "";
        $scope.footprintMessage = "";
        $scope.speedMessage = "";
        $scope.weirdFunction = "";
        $scope.missingFunction = "";
        $scope.bug = "";
        $scope.makeItBetter = "";
        $scope.dailyUse = "";
        $scope.betterThanFB = "";

        $scope.globalRate = -1;
        $scope.colorRate = -1;
        $scope.duelRate = -1;
        $scope.voteRate = -1;
        $scope.footprintRate = -1;
        $scope.speedRate = -1;

        $scope.fullForm = false;
        $scope.sendSatisfactionFormSuccessfully = false;
        $scope.sendSatisfactionFormMessage = "";
        $scope.sendBugFormSuccessfully = false;
        $scope.sendBugFormMessage = "";

        $scope.showFullForm = _showFullForm;
        $scope.sendBug = _sendBug;
        $scope.sendSatisfaction = _sendSatisfaction;
        $scope.translationService = translationService;
    };
    app.controller("bugController", ['$scope', 'emailService', 'translationService', '$timeout', '$location', 'authService', bugController]);
}(angular.module("socialFootprintApp")));
