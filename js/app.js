
var authClient = new OktaAuth({
  url: 'https://oktacdev021.oktapreview.com/oauth2/ausak4rcb3sW3BmB20h7',
  clientId: 'yFRyrCIvqfq6MDalZzng',
  redirectUri: window.location.href,
  issuer: 'https://oktacdev021.oktapreview.com/oauth2/ausak4rcb3sW3BmB20h7',
  authorizeUrl: 'https://oktacdev021.oktapreview.com/oauth2/ausak4rcb3sW3BmB20h7/v1/authorize'
});

var app = new Vue({
  el: '#app',
  http: {
    headers: {
      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  },
  data: {
    title: 'Welcome',
    message: 'Okta Ice Management',
    isLogged: false,
    accessToken: null,
    scopes: null,
    newPromo: {
      code: null,
      validity: null,
      target: null,
      description: null
    },
    promos: null
  },
  methods: {
    //Triggers authentication in Okta using implicit flow.
    login: function () {
      authClient.token.getWithRedirect({
        responseType: ['token', 'id_token'],
        scopes: ['promos:read', 'openid', 'profile', 'email'],
      });
    },
    logout: function () {
      app.$data.title = 'Welcome';
      app.$data.message = 'Okta Ice Management';
      window.localStorage.removeItem('access_token');
      window.localStorage.removeItem('id_token');
      app.$data.isLogged = false;
    },
    checkToken: function () {
      // If the token is in the url after the redirect
      authClient.token.parseFromUrl().then(function(tokenArray) {
        var accessToken = tokenArray[0];
        var idToken = tokenArray[1];
        app.$data.title = idToken.claims.name;
        app.$data.message = idToken.claims.email;
        app.$data.isLogged = true;
        app.$data.accessToken = accessToken.accessToken;
        app.$data.scopes = accessToken.scopes;
      }).catch(function(err) {
        // Handle OAuthError
        console.log(err);
      });
    },
    getPromos: function() {

      // GET request
      this.$http.get('https://ice-rs-oktavius.herokuapp.com/publicpromos', function (data) {
          // set data on vm
          app.$data.promos = data;
          console.log(data);

      }).error(function (data, status, request) {
          // handle error
          console.log("ERROR: "+data);
      })
    },
    savePromo: function() {
      // GET request
      this.$http.post('https://ice-rs-oktavius.herokuapp.com/promos', app.$data.newPromo, {emulateJSON:true}, function(res){
          // resetform
          app.$data.newPromo.code = null;
          app.$data.newPromo.validity = null;
          app.$data.newPromo.target = null;
          app.$data.newPromo.description = null;
      }).error(function (data, status, request) {
          // handle error
          console.log("ERROR: "+data);
      })
    }
  },
  beforeMount(){
    this.checkToken()//Verify if a token exists
  }
})
