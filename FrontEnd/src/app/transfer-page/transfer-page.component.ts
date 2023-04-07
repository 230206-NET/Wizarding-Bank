import { Component,OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TransferService } from '../transfer.service';
import { UserDataService } from '../user-data.service';
import {of, firstValueFrom, pipe} from 'rxjs'
import { CookieService } from '../../../node_modules/ngx-cookie-service';

@Component({
  selector: 'app-transfer-page',
  templateUrl: './transfer-page.component.html',
  styleUrls: ['./transfer-page.component.css']
})
export class TransferPageComponent implements OnInit{
  mode : string = "card";
  constructor(private cookieSerive : CookieService, private router: Router, private fb: FormBuilder, private api:TransferService, private userData: UserDataService){}
  UID = parseInt(this.cookieSerive.get('userId')) 
  
  transaction : string;
  cards : any[];
  banks : any[];
  walletamt : number;
  showselected : boolean = false;
  selected : string;


  ngOnInit(): void {

    //get all cards
      this.userData.getUserCards(this.UID).subscribe((data:any) => {
        this.cards = data
      })

      //get all bank accounts
      this.userData.getUserAccounts(this.UID).subscribe((data:any) => {
        this.banks = data
      })

    }



  cardForm : FormGroup = this.fb.group({
    cardAmount : new FormControl()
  })

  bankForm : FormGroup = this.fb.group({
    bankAmount : new FormControl()
  })

  toggleMode(mode : string) : void {
    this.mode = mode;
  }




  confirm(event: Event): void{
    event.preventDefault();
    console.log("confirm Function");
    this.router.navigate(['/UserHome']);
  }


  processCardForm(e: Event) : void {
    e.preventDefault();
    this.cardForm.markAllAsTouched();
    if(this.cardForm.valid) {
      let A = this.cardForm.value['cardAmount'];
      let C = parseInt(this.selected)


           //get wallet balance
           this.userData.getWalletBalance(this.UID).subscribe(data => {
            if (data == null ){}
            else{
              this.walletamt = data['wallet']; 
              if(this.walletamt >= A){
                this.api.walletToCard(this.UID, C, A).subscribe(data => {if(data != null) this.transaction = data['amount']});

              }
              else alert('Not enough money')
            }     
          });

    }
  }


  async processBankForm(e: Event) : Promise<void> {
    e.preventDefault();
    this.bankForm.markAllAsTouched();
    if(this.bankForm.valid) {
      let A = this.bankForm.value['bankAmount']; 
      let B = parseInt(this.selected)   

      // get wallet balance
      this.userData.getWalletBalance(this.UID).subscribe(data => {
        if (data == null ){}
            else{
              this.walletamt = data['wallet']; 
              if(this.walletamt >= A){
                this.api.walletToAccount(this.UID, B, A).subscribe(data => {if(data != null) this.transaction = data['amount']});
              }
              else alert('Not enough money') 
            }
      
      });

      

    }

  }

  select(e : Event, selec : string, type : string){
    this.showselected = true;
    this.selected = selec;
  }
  unselect()
  {
    this.showselected = false;
  }

}

