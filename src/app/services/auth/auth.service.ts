import { Injectable, NgZone } from '@angular/core';
import { User } from '../../models/user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import {BehaviorSubject, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: Observable<User>; // Save logged in user data

  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.userData = afAuth.authState;
  }

  isSetUserSession(): boolean {
    return !!localStorage.getItem('user');
  }

  SignIn(email, password) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(res => {
          if (res.user.emailVerified) {
            this.router.navigate(['dashboard']);
            this.SetUserData(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.loggedIn.next(this.isSetUserSession());
            resolve(res);
          } else {
            throw new Error('Email not verified');
          }
        }, err => reject(err))
        .catch((error) => {
          return reject(error);
        } );
    });
  }
  SignUp(email, password) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          this.SendVerificationMail();
          this.SetUserData(res.user);
          resolve(res);
        }, err => reject(err));
    });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
  }

  /*// Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }*/

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
    SetUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      // firstName: user.firstName,
      // lastName: user.lastName,
      emailVerified: user.emailVerified
    };
    return userRef.set( Object.assign({}, userData), {
      merge: true
    });
  }

  // Sign out
  SignOut() {
      return new Promise<any>((resolve, reject) => {
        this.afAuth.auth.signOut().then((res) => {
          localStorage.removeItem('user');
          this.loggedIn.next(this.isSetUserSession());
          this.router.navigate(['home']);
          resolve(res);
        }, err => reject(err));
      });

    /*return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['home']);
    });*/
  }
}
