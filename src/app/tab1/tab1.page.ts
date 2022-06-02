import { Component } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { NewArticlePage } from '../new-article/new-article.page';
import { NewHousePage } from '../new-house/new-house.page';
import { ListArticlePage } from '../list-article/list-article.page';
import { ProfilPage } from '../profil/profil.page';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  admin:boolean=false
  profil
  constructor(public fx:FunctionsService,public storage:Storage) {
    this.fx.connect()
    this.storage.get('profil').then(values=>{
      this.profil=values
      if(values.logo=='logo.png'){
        this.admin=true
      }
    console.log(this.admin);
    })
  }
  // Click on one option
  openWin(title:string){
    if (title=='article') {
      this.fx.openWin(NewArticlePage)
    }
    else if (title=='house') {
      this.fx.openWin(NewHousePage)
    }
    else if (title=='articles') {
      this.fx.openWin(ListArticlePage)
    }
    else if (title=='profil') {
      this.fx.openWin(ProfilPage)
    }
  }
}
