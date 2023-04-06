import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { JwtDecoderService } from '../jwt-decoder.service';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { UserDataService } from '../user-data.service';
import { Transaction } from '../Interfaces/transaction';
import { TransactionHistoryService } from '../transaction-history.service';
import { CookieService } from '../../../node_modules/ngx-cookie-service';
@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
})
export class UserHomeComponent implements OnInit {
  Transactions: Array<Transaction> = []
  user: string | undefined;

  token: string | undefined | null = localStorage.getItem('access_token');
  constructor(private cookieService: CookieService, private transactions: TransactionHistoryService, public authService: Auth0Service, private jwtDecoder: JwtDecoderService, private userData: UserDataService) { }
  async ngOnInit(): Promise<void> {
    this.userData.email = this.cookieService.get('email')

    console.log(this.userData.getUser())
    this.userData.retrieveUserIdFromDB(this.userData.getUser()).subscribe(x => {
      this.userData.Id = x;
      this.user = this.userData.Id;
      this.transactions.getMostRecentTransactions(x).subscribe(w => {
        this.Transactions = w;
      })
    })
  }

}



