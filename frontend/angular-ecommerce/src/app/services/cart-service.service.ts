import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  

  cartItems: CartItem[]=[];

  totalPrice:Subject<number> =new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> =new BehaviorSubject<number>(0);


  //no data loss in page refresh
  storage: Storage = sessionStorage;

  constructor() { 


    let data = JSON.parse(this.storage.getItem('cartItems'));

    if(data!= null) {
      this.cartItems = data;

      this.computeCartTotals();
    }
  }

  addToCart(theCartItem:CartItem){
    let alreadyExistsInCart:boolean=false;
    let existingCartItem:CartItem=undefined;

    if(this.cartItems.length >0){
      
      existingCartItem=this.cartItems.find(tempCartItem=> tempCartItem.id===theCartItem.id);

      alreadyExistsInCart=(existingCartItem !=undefined);
    }

    if(alreadyExistsInCart){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
    

  }
  computeCartTotals() {
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue+=currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue+= currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);


    this.persistCartItems();
  }


persistCartItems(){
  this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
}




  decrementQuantity(tempCartItem: CartItem) {
    tempCartItem.quantity--;

    if(tempCartItem.quantity===0){
      this.remove(tempCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  remove(tempCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem=>tempCartItem.id===tempCartItem.id);

    if(itemIndex>-1){
      this.cartItems.splice(itemIndex,1);

      this.computeCartTotals();
    }

  }

}
