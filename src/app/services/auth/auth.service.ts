import {Injectable} from '@angular/core';
import {User} from '../../models/user';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFireFunctions} from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: Observable<User>; // Save logged in user data

  private loggedIn = new BehaviorSubject<boolean>(this.isSetUserSession());

  get isLoggedIn(): Observable<boolean> {
    // @ts-ignore
    return this.loggedIn.asObservable();
  }

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router  ) {
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
          this.SendVerificationMail()
            .then(
              verRes => {
                this.router.navigate(['verify-email-address']);
                },
              err => console.log(err.message));
          this.SetUserData(res.user).then(resp => {console.log('Set User data ', resp); }, errr => console.log(errr.message));
          resolve(res);
        }, err => reject(err));
    });
  }
  // Send email verification when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  ChangePassword(newPassword) {
    return this.afAuth.user.subscribe(res =>
    res.updatePassword(newPassword).then(
      () => {
        window.alert('Password succesfully changed.');
      }).catch((error) => {
        window.alert(error);
      }
    ));
  }

  // Reset Forgot password
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
      emailVerified: user.emailVerified
    };
    return userRef.set( userData, {merge: true});
  }

  // Sign out
  SignOut() {
      return new Promise<any>((resolve, reject) => {
        this.afAuth.auth.signOut().then((res) => {
          localStorage.removeItem('user');
          this.loggedIn.next(this.isSetUserSession());
          this.router.navigate(['home']);
          resolve({Signout: 'Success'});
        }, err => reject(err));
      });
  }
}
