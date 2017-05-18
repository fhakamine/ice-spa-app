
var authClient = new OktaAuth({
  url: 'https://frederico.oktapreview.com/oauth2/ausai1vaugWVwHpSD0h7',
  clientId: 'n26ajsDBeitlUuKReKpq',
  redirectUri: window.location.href,
  issuer: 'https://frederico.oktapreview.com/oauth2/ausai1vaugWVwHpSD0h7',
  authorizeUrl: 'https://frederico.oktapreview.com/oauth2/ausai1vaugWVwHpSD0h7/v1/authorize'
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
        scopes: ['promos:create', 'promos:read', 'promos:cancel', 'openid', 'profile', 'email'],
      });
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
      this.$http.get('https://ice-rs-fred.herokuapp.com/promos', function (data) {
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
      this.$http.post('https://ice-rs-fred.herokuapp.com/promos', app.$data.newPromo, {emulateJSON:true}, function(res){
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
