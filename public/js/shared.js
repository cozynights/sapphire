(function(sapphire) {
    // load the api & assemble request

    function start() {
        // 2. Initialize the JavaScript client library.
        gapi.client.init({
            'apiKey': 'YOUR_API_KEY',
            // Your API key will be automatically added to the Discovery Document URLs.
            'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
            // clientId and scope are optional if auth is not required.
            'clientId': 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
            'scope': 'profile',
        }).then(function() {
            // 3. Initialize and make the API request.
            return gapi.client.people.people.get({
            'resourceName': 'people/me',
            'requestMask.includeField': 'person.names'
            });
        }).then(function(response) {
            console.log(response.result);
        }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    };
        // 1. Load the JavaScript client library.
    gapi.load('client', start); 
    var GoogleAuth;

    /**
     * Load the API's client and auth2 modules.
     * Call the initClient function after the modules load.
     */
    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        // Initialize the gapi.client object, which app uses to make API requests.
        // Get API key and client ID from API Console.
        // 'scope' field specifies space-delimited list of access scopes

        gapi.client.init({
            'clientId': 'REPLACE_ME',
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
            'scope': 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner'
        }).then(function () {
            GoogleAuth = gapi.auth2.getAuthInstance();

            // Listen for sign-in state changes.
            GoogleAuth.isSignedIn.listen(updateSigninStatus);

            // Handle initial sign-in state. (Determine if user is already signed in.)
            setSigninStatus();

            // Call handleAuthClick function when user clicks on "Authorize" button.
            $('#execute-request-button').click(function() {
                handleAuthClick(event);
            }); 
        });
    }

    function handleAuthClick(event) {
        // Sign user in after click on auth button.
        GoogleAuth.signIn();
    }

    function setSigninStatus() {
        var user = GoogleAuth.currentUser.get();
        isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner');
        
        // Toggle button text and displayed statement based on current auth status.
        if (isAuthorized) {
            defineRequest();
        }
    }

    function updateSigninStatus(isSignedIn) {
        setSigninStatus();
    }

    function createResource(properties) {
        var resource = {};
        var normalizedProps = properties;

        for (var p in properties) {
            var value = properties[p];
            if (p && p.substr(-2, 2) == '[]') {
                var adjustedName = p.replace('[]', '');
                if (value) {
                    normalizedProps[adjustedName] = value.split(',');
                }
                delete normalizedProps[p];
            }
        }

        for (var p in normalizedProps) {
        // Leave properties that don't have values out of inserted resource.
            if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
                var propArray = p.split('.');
                var ref = resource;
                for (var pa = 0; pa < propArray.length; pa++) {
                    var key = propArray[pa];
                    if (pa == propArray.length - 1) {
                        ref[key] = normalizedProps[p];
                    } 
                    else {
                        ref = ref[key] = ref[key] || {};
                    }
                }
            };
        }

        return resource;
    }

    function removeEmptyParams(params) {
        for (var p in params) {
            if (!params[p] || params[p] == 'undefined') {
                delete params[p];
            }
        }
        return params;
    }

    function executeRequest(request) {
        request.execute(function(response) {
            console.log(response);
        });
    }

    sapphire.buildApiRequest = function(requestMethod, path, params, properties) {
        params = removeEmptyParams(params);
        var request;
        if (properties) {
            var resource = createResource(properties);
            request = gapi.client.request({
                'body': resource,
                'method': requestMethod,
                'path': path,
                'params': params
            });
        } 
        else {
            request = gapi.client.request({
                'method': requestMethod,
                'path': path,
                'params': params
            });
        }
        executeRequest(request);
    };

    // sapphire.table = {
    //     loadAllActivePackages: loadAllActivePackages,
    // };

})(window.sapphire = window.sapphire || {});
