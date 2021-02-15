import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems:CartItem[]=[];
  totalPrice:number=0;
  totalQuantity:number=0;

  constructor(private cartService:CartServiceService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    this.cartItems=this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data=> this.totalPrice=data
    );
    this.cartService.totalQuantity.subscribe(
      data=> this.totalQuantity=data
    );

      this.cartService.computeCartTotals();


  }

  incrementQuantity(tempCartItem:CartItem){
    this.cartService.addToCart(tempCartItem);
    
  }
  decrementQuantity(tempCartItem:CartItem){
    this.cartService.decrementQuantity(tempCartItem);
  }
  remove(tempCartItem:CartItem){

    this.cartService.remove(tempCartItem);
    
  }

}
