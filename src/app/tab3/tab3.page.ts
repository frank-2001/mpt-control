import { Component } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
mouv:any=[]
time=new Date()
admin:boolean=false
profil:any
  constructor(public fx:FunctionsService,public storage:Storage) {
    this.init() 
    this.getMouv()
    this.storage.get('profil').then(values=>{
      this.profil=values
      if(values.logo=='logo.png'){
        this.admin=true
      }
    })
  }
  caisseAmountD:number=0
  caisseAmountF:number=0
  decaisseAmountD:number=0
  decaisseAmountF:number=0
  houses:any=[]
  credit:any=[]
  getMouv(){
    this.credit=[]
      this.storage.get('mouvementStock').then(value=>{  
        // value[1].unshift(value[0])
        // this.storage.set('mouvementStock',value[1])  
        console.log(value);
         
      this.mouv=value
      for (let i = 0; i < this.mouv.length; i++) {
        if(this.mouv[i].action=='Sortie'){
          this.mouv[i].action="Vente"
        }
        if(this.mouv[i].action=='Entrer'){
          this.mouv[i].action="Achat"
        }
        if(this.mouv[i].action=='Crédit'){
          this.mouv[i].action="Achat"
        }
      }
      this.credit=this.mouv.filter(el=>el.payment=='Crédit')
      var caisse=this.mouv.filter(el=>el.payment=='Cash' || el.payment=='encaisse' || el.payment=='Reglement' )
      var decaisse=this.mouv.filter(el=>el.payment=='decaisse')

      this.caisseAmountD=0
      this.caisseAmountF=0

      for (let n = 0; n < caisse.length; n++) {
        if(caisse[n].devise=='$'){
          this.caisseAmountD+=caisse[n].cout
        }
        else if(caisse[n].devise=='Fc'){
          this.caisseAmountF+=caisse[n].cout
        }
      }
      this.decaisseAmountD=0
      this.decaisseAmountF=0
      for (let n = 0; n < decaisse.length; n++) {
        if(decaisse[n].devise=='$'){
          this.decaisseAmountD+=decaisse[n].cout
        }
        else if(decaisse[n].devise=='Fc'){
          this.decaisseAmountF+=decaisse[n].cout
        }
      }
      console.log(decaisse);
      
      console.log(decaisse+'Decaisse '+this.decaisseAmountD+' $ - '+this.decaisseAmountF);
      
    })
    this.storage.get('house').then(value=>{
      this.houses=value
      console.log(this.houses);
      
    })
  }
  //Paiement credit input id de l'article
encaisse(id){
    this.storage.get('mouvementStock').then(values=>{
        var paiement=values.filter(el=>el.id==id)[0]
        paiement.payment='Reglement'
        paiement.libele=new Date(paiement.time).toLocaleDateString("fr-FR")+' '+paiement.libele
        paiement.time=this.time.getTime()
        console.log(paiement);
        var newMouv=values.filter(el=>el.id!=id)
        newMouv.unshift(paiement)
        console.log(newMouv);
        
        this.storage.set('mouvementStock',newMouv)
        this.fx.toastMsg('Crédit paiyée avec succees','primary',2000)
        this.credit=[]
        this.getMouv()
    })    
  }
  libele=null
  amount=null
  devise=null
  saveEntrer(libele:any,amount:number,devise:any){
    var detail={id:null,pu:null,payment:'encaisse',names:libele,action:'encaisse',house:this.houses[0].id,qte:1,cout:amount,devise:devise,time:this.time.getTime(),state:0,idArticle:null,libele:this.houses[0].names}
      console.log(libele+' - '+amount+' - '+devise);
      this.storage.get('mouvementStock').then(values=>{
        values.unshift(detail)
        this.storage.set('mouvementStock',values)
        this.getMouv()
      })
      this.libele=null
      this.amount=null
      this.devise=null
    }
  saveSortie(libele:any,amount:number,devise:any){
    var detail={id:null,pu:null,payment:'decaisse',names:libele,action:'decaisse',house:this.houses[0].id,qte:1,cout:amount,devise:devise,time:this.time.getTime(),state:0,idArticle:null,libele: this.houses[0].names}
    console.log(libele+' - '+amount+' - '+devise);
    var mCaisse=0
    if (devise=='$') {
      mCaisse=this.caisseAmountD-this.decaisseAmountD
    }
    if (devise=='Fc') {
      mCaisse=this.caisseAmountF-this.decaisseAmountF
    }

    if (amount<=mCaisse) {
    this.storage.get('mouvementStock').then(values=>{
      values.unshift(detail)
      this.storage.set('mouvementStock',values)
    })
    this.libele=null
    this.amount=null
    this.devise=null
  }else{
    this.fx.toastMsg('Montant superieur a la caisse','warning',3000)
  }
  }
info(id){
  var art=this.mouv.filter(el=>el.id==id)[0]
  this.fx.toastMsg(art.libele,'primary',4000)
}
  async init() {
    const storage = await this.storage.create();
  }
}
