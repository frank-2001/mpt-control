import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { FunctionsService } from '../functions.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
admin:number=0
new:number=0
  constructor(public http:HttpClient,public fx:FunctionsService,public storage:Storage) { }
load=null
connect(house,pass){
  this.load=0
console.log(house+' '+pass);
this.http.get<any>(this.fx.server+'?connect&house='+house+'&pass='+pass+'&admin='+this.admin).subscribe(
  reponse=>{
    this.load=1
      console.log(reponse); 
      if(reponse.profil.length==0) {
        this.fx.toastHttp(reponse,3000) 
      }else{
        this.storage.set('abonnement',reponse.state)
        this.storage.set('mouvementStock',[])
        this.storage.set('articles',[])
        this.storage.set('house',[])
        this.fx.saveStorage('profil',reponse.profil[0],'add','close')
        console.log(reponse.data);
        var house=[]
        var mouv=[]
        var articles=[]
        for (let i = 0; i < reponse.data.length; i++) {
          var data=JSON.parse(reponse.data[i].dataHouse)
          console.log(data.articles);
          house.push(data.house)
          for (let n = 0; n < data.articles.length; n++) {
            articles.push(data.articles[n])
          }
          for (let n = 0; n < data.mouv.length; n++) {
            mouv.push(data.mouv[n])            
          }
        }
        this.fx.toastMsg('Connecter avec succes','primary',2000) 
        this.fx.saveStorage('house',house,'add','')
        this.fx.saveStorage('articles',articles,'add','')
        this.fx.saveStorage('mouvementStock',mouv,'add','') 
        this.fx.toastHttp(reponse,3000) 
        setTimeout(()=>{
          location.reload();  
        },2000)
      }

  },error=>{
      this.load=1
        this.fx.testNet();
        console.log(error); 
  })
}
names:any
onkey(event: any,names:any) { // without type info
  console.log(event.keyCode,names);
    this.names=this.names.replace(' ','')
    this.names=this.names.toLowerCase()
  }
saveAdmin(names,phone,password){
  this.http.get<any>(this.fx.server+'?newAdmin&names='+names+'&telephone='+phone+'&password='+password).subscribe(reponse=>{
    if (reponse.state==true) {
      this.admin=1
      this.connect(phone,password)
    }else{
      this.fx.toastMsg("Ce numero existe deja",'warning',2000)
    }
  })
}
  ngOnInit() {
  }

}
