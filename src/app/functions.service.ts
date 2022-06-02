import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { SignInPage } from './sign-in/sign-in.page';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {
  server:any="https://instano.nunua-store.com/api/index.php"
  // server:any="http://localhost/mapathi/Api/index.php"
  abonnemenet=null
  constructor(public router:Router,public http:HttpClient,public modalCtrl:ModalController,public toast:ToastController,public storage:Storage) {
    this.init()
    setInterval(()=>{
      this.update()
    },60000*30)
   }
   testNet(){
     //Cette fonction verifie la connexion internet et renvoie un message toast du resultat
     this.http.get(this.server).subscribe(
       reponse=>{
       },error=>{
         this.toastMsg('Echec de connexion','danger',2000)
       }
     )
   }
  // This code open page in a Modal,Input name of the page
  async openWin(page:any) {
    const modal = await this.modalCtrl.create({
      component: page,
      cssClass: 'my-custom-class',
      // componentProps: {
        //   'allart':this.tdata.allart,
      // }
    });
    return await modal.present();
  }
  // THIS FUNCTION CLOSE EVERY MODAL'S
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  // Save Data in Storage DB @ionic/angular-storage
  // Input name of table data option : add or update
  saveStorage(index:any,data:any,option:string,state:string){
    this.init()
    var newData=[]
    if (option=='update') {
      this.storage.get(index).then(value=>{
          value.unshift(data)
        this.storage.set(index, value).then(()=>{
          if(state=='close'){
            this.dismiss()
          }
          })
        console.log("update");
      }).catch(()=>{
        this.storage.set(index,[data]).then(()=>{
          this.storage.get('upload').then(values=>{
            if(values!=null){
              values[1].state=0
              this.storage.set('upload',values)
            }
          })
          if(state=='close'){
            this.dismiss()
          }
          })
        console.log("add");
        })

    }
    else{
      this.storage.set(index,data).then(()=>this.dismiss())
      console.log("add");
      // this.storage.get('upload').then(values=>{
      //   if(values!=null){
      //     values[1].state=0
      //     this.storage.set('upload',values)
      //   }
      // })
    } 
  }
  // Get Data by storage DB
  getStorage(index){
    this.init()
    this.storage.get(index).then(val=>{
      return val
    }).catch(err=>{
      return
    })
  }
  // THIS FUNCTION SHOW TOAST MESSAGE
  async toastMsg(message:any,color:string,duration:number){
    const toast = await this.toast.create({
      message:message,
      duration: duration,
      position: "top",
      color: color,
    });
    toast.present();      
  }  
// Account verificator
  connect(){
    this.storage.get('profil').then(value=>{
      if(value==null){
        this.toastMsg('Veuiller vous conneter svp','warning',2000)
        this.openWin(SignInPage)
      }
    }).catch(err=>{
    })

}
//Auto updata Admin each 60 munites
update(){
  this.toastMsg('Mise en jour en cours','primary',2000)
  this.storage.get('profil').then(value=>{
    if (value.logo!=null) {
        this.http.get<any>(this.server+'?mydata='+value.id).subscribe(reponse=>{
          this.toastHttp(reponse,3000) 
      if(reponse.profil.length==0) {
        // this.toastMsg(reponse.message,'warning',2000) 
      }else{
        this.storage.set('mouvementStock',[])
        this.storage.set('articles',[])
        this.storage.set('house',[])
        this.saveStorage('profil',reponse.profil[0],'add','')
        var house=[]
        var mouv=[]
        var articles=[]
        for (let i = 0; i < reponse.data.length; i++) {
          var data=JSON.parse(reponse.data[i].dataHouse)
          house.push(data.house)
          for (let n = 0; n < data.articles.length; n++) {
            articles.push(data.articles[n])
          }
          for (let n = 0; n < data.mouv.length; n++) {
            mouv.push(data.mouv[n])            
          }
        }
        this.saveStorage('house',house,'add','')
        this.saveStorage('articles',articles,'add','')
        this.saveStorage('mouvementStock',mouv,'add','') 
        this.saveStorage('upload','','add','') 
        }
      },error=>{
        this.testNet()
      })     
    }
  })
}
    // Ouvrir une page
    openPage(page:any,data:any){
      this.router.navigate([page],{queryParams:{data}});
}
toastHttp(reponse,time:number){
  if (reponse.state==true) {
    this.toastMsg(reponse.message,'primary',time)
    this.dismiss
  }
  if (reponse.state==false) {
    this.toastMsg(reponse.message,'danger',time)
  }
}
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
  }
}
 
