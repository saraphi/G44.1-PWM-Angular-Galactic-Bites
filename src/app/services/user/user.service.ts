import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { FirebaseAuthService } from '../database/firebase-auth.service';
import { __await } from 'tslib';
import { waitForAsync } from '@angular/core/testing';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firebaseAuthService: FirebaseAuthService, private shoppingCartService: ShoppingCartService) {}

  user: User | null = null;

  //  async isLogged(): Promise<boolean> {
  //    return true//return await this.firebaseAuthService.isLoggedIn();
  //  } 

  isLogged(): boolean {
    return (this.user != null);
  }

  async logout(): Promise<void> {
    return await this.firebaseAuthService.logout().then(() => {
      this.user = null;
    })
  }
  
  async login(email: string, password: string, ): Promise<boolean>  {
    return await this.firebaseAuthService.login({ email, password })
      .then(async user => {
        this.user = user;
        await this.setUpCarritoWey();
        return true;
      })
      .catch(e => {
        console.error('error logging in user', e)
        return false;
      });
  }

  async signup(name: string, email: string, password: string, phone: string): Promise<boolean> {  
    return await this.firebaseAuthService.signUp({ email, password, name, phone })
      .then((user) => {
        this.user = user;
        console.log(user);
        if (this.user != null) return true;
        return false;
      })
      .catch((e) => {
        console.error('error signing up user', e)
        return false;
      });
  }
  async setUpCarritoWey(): Promise<void> {
    return this.shoppingCartService.setData(this.user.shoppingCart);
}

  async emailExists(email: string): Promise<boolean> {
    return this.firebaseAuthService.checkIfEmailExists(email)
      .then((value) => {
        return value;
      })
      .catch((e) => {
        console.error('error checking email', e)
        return false;
      });
  }

  checkPassword(email: string, password: string): boolean {
    return true;
  } 
}