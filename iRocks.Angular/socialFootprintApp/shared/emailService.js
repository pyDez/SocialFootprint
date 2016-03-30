(function () {

    var emailService = function ($http, ngAuthSettings, $q) {



        var serviceBase = ngAuthSettings.apiServiceBaseUri;

        var emailService = {};

        var _sendEmail = function (to, message) {
            var deferred = $q.defer();
            var emailModel = {To: to, Body: message }
            $http.post(serviceBase + 'api/email', emailModel).success(function (response) {

                deferred.resolve(response);

            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var _sendBugReport= function (message) {
            var deferred = $q.defer();
            var emailModel = { To: '', Body: message }
            $http.post(serviceBase + 'api/email?isBugReport=true', emailModel).success(function (response) {

                deferred.resolve(response);

            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        
        emailService.sendBugReport = _sendBugReport;
        emailService.sendEmail = _sendEmail;
        return emailService;
    };

    var module = angular.module("socialFootprintApp");
    module.factory('emailService', ['$http', 'ngAuthSettings', '$q', emailService]);
}());