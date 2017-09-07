angular.module('myApp').factory('IPReception', function ($resource, appConfig) {
    return $resource(appConfig.djangoUrl + 'ip-reception/:id/:action/', {}, {
        query: {
            method: 'GET',
            isArray: true,
            interceptor: {
                response: function (response) {
                    response.resource.$httpHeaders = response.headers;
                    return response.resource;
                }
            },
        },
        receive: {
            method: 'POST',
            params: { action: "receive", id: "@id" }
        },
        changeSa: {
            method: "PATCH",
            params: { id: "@id" },
        },
        identify: {
            method: "POST",
            params: { action: "identify-ip" }
        },
        submit: {
            method: 'POST',
            params: { action: "submit", id: "@id" }
        },
    });
});
