import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { Storage } from '@ionic/storage-angular';
import { HttpClient} from '@angular/common/http';
import { ResourceLoader } from '@angular/compiler';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
profil:any=[]
agree:boolean=false
last:any
data:any={house:null,articles:null,mouvement:null}
load:number=0
sub:boolean
constructor(public http:HttpClient,public fx:FunctionsService,public storage:Storage) {
  this.fx.connect()
  this.storage.get('profil').then(values=>{
    this.profil=values
    this.load+=1
    console.log(this.profil);
    console.log(this.profil.logo);
  })
    this.storage.get('house').then(house=>{
      this.data.house=house
      this.load+=1
    })
    this.storage.get('articles').then(article=>{
      this.data.articles=article
      this.load+=1
    })
    this.storage.get('mouvementStock').then(mouv=>{
      this.data.mouvement=mouv
      this.load+=1
    })
    if (this.load==3) {
      console.log(this.data);
      
    }
  this.storage.get('upload').then(values=>{
    this.last=values[0].time
    console.log(values);
    if(values[1].state==0){
      this.agree=true
    }
  }).catch(err=>{
    this.agree=true
  })
  this.storage.get('abonnement').then(value=>{
    this.sub=value
  })
   }
time=new Date()
stamp=this.time.getTime()
all:any
myAc:boolean=false
sendData(){
  console.log(this.data);
  var house=this.data.house
  var mouv=this.data.mouvement
  var articles=this.data.articles
  this.http.post<any>(this.fx.server+'?upload&house-name='+this.data.house[0].names+'&id-admin='+this.profil.idAdmin+'&idUser='+this.profil.id,{house:this.data.house[0],articles:this.data.articles,mouv:this.data.mouvement}).subscribe(val=> {
      // console.log(JSON.parse(val));
      this.fx.toastHttp(val,3000)
      if (val.state==false) {
        this.myAc=true
      }
      this.agree=true
  })    
  // }
}
alert=0
check(){
if(this.agree==true){
  this.alert=1
}else{
  this.dec()
}
}
dec(){
this.fx.toastMsg('Deconnexion en cours....','danger',2000)
this.storage.remove('mouvementStock')
this.storage.remove('articles')
this.storage.remove('house')
this.storage.remove('profil')
this.storage.remove('upload')
this.storage.remove('abonnement')
this.fx.dismiss()
setTimeout(()=>{
  location.reload();  
},2000)
}
delManager(id){
  this.http.get<any>(this.fx.server+'?deleteUser='+id).subscribe(answer=>{
    this.fx.toastMsg(answer.message,'warning',2000)
    this.myHouse()
    // this.fx.update()
  })
}
accountH=[]
loadX=0
myHouse(){
  this.http.get<any>(this.fx.server+'?getHouse='+this.profil.id).subscribe(reponse=>{
    this.loadX=1
    this.accountH=reponse.data
    console.log(reponse);
  },error=>{
    this.fx.testNet()
  })
}
  ngOnInit() {
  }

}
