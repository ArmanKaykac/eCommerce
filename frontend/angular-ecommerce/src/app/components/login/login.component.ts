import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import MyAppConfig from '../../config/my-app-config';
import * as OktaSignIn from '@okta/okta-signin-widget';
import myAppConfig from '../../config/my-app-config';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  oktaSignin:any;
  constructor(private oktaAuthService: OktaAuthService) {

    this.oktaSignin = new OktaSignIn({
      features:{
        registration: true
      },
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    }
    );


   }

  ngOnInit(): void {

    this.oktaSignin.remove();


    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'
    },
    (response) =>{
      if (response.status === 'SUCCESS'){
        this.oktaAuthService.signInWithRedirect();
      }
    },
    (error)=>{
      throw error;
      
    }
      )

  }

}
