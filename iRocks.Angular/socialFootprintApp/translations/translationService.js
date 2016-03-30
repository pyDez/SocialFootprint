
(function () {

    var translationService = function ($http) {

        var translationFactory = {};
        _getTranslation = function (language) {
            var supportedLanguages =['en', 'fr'];
            if (supportedLanguages.indexOf(language) < 0)
            {
                language = 'en';
            }
            var languageFilePath = 'translation_' + language + '.json';
            return $http.get('socialFootprintApp/translations/' + 'translation_' + language + '.json').then(function (results) {
                translationFactory.translations = results.data;
                return results.data;
            });
            
        };
        translationFactory.translations = {};
        translationFactory.getTranslation = _getTranslation;
        return translationFactory;
    };

    var module = angular.module("socialFootprintApp");
    module.factory('translationService', ['$http', translationService]);
}());