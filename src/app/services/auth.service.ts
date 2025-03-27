import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import PocketBase from 'pocketbase';
import { EmailService } from './email.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private emailService: EmailService) { }

pb = new PocketBase(environment.pocketbaseUrl)

async register(user: User) {
  const res = await this.pb.collection('users').create({
    ...user
  });
  await this.emailService.sendEmail(
    user.email,
    'Benvenuto nel Servizio PDG',
    `Benvenuto in PDG, grazie per esserti registrato.

    La tua password è: ${user.password}

    Cordiali saluti,
    `
  );
  return res;
}


signOut() {
  localStorage.removeItem('user');
  return this.pb.authStore.clear();
}

async signInPassword(email: string, password: string) {
  const authData = await this.pb
    .collection('users')
    .authWithPassword(email, password);
  const user = await this.getUserById(authData.record.id as string);
  return user;
}

async verifyOTP(otpId: string, otp: string) {
  return this.pb.collection('users').authWithOTP(otpId, otp);
}

async signInOTP(email: string) {
  return await this.pb.collection('users').requestOTP(email);
}

async getUserById(id: string) {
  const user = await this.pb
    .collection('users')
    .getOne(id, );
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

async requestVerification(email: string) {
  return await this.pb
    .collection('users')
    .requestVerification(email);
}



getValidatedUser() {
  return this.pb.authStore.isValid;
}

async verifyEmail(verificationId: string) {
  return await this.pb
    .collection('users')
    .confirmVerification(verificationId);
}

cancelAllRequests() {
  return this.pb.cancelAllRequests();
}

getCurrentUser() {
  const currentUser = JSON.parse(
    localStorage.getItem('user') as string
  ) as User;
  return currentUser;
}



}
