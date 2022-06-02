import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  articles:any=[]
  house:any=[]
  constructor(public fx:FunctionsService,public storage:Storage) {
    this.storage.create();
    this.storage.get('articles').then(value=>{
      console.log(value)
      for (let index = 0; index < value.length; index++) {
        if(this.house.filter(el=>el==value[index].house).length==0){
          this.house.push(value[index].house);
        }
      }
      this.articles=value
      console.log(this.house);
      
    })

  }
reload(){
  this.storage.get('articles').then(value=>this.articles=value) 
}
    async init() {
      // If using, define drivers here: await this.storage.defineDriver(/*...*/);
      const storage = await this.storage.create();
    }
}
