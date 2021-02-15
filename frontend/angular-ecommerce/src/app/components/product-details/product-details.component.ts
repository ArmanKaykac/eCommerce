import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product:Product=new Product;

  constructor(private productService:ProductService,
    private route:ActivatedRoute,
    private cartService:CartServiceService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(()=>{
      this.handleProductDetails();
    })
  }
  handleProductDetails() {
    const theProductId:number= + this.route.snapshot.paramMap.get('id');

    this.productService.getProduct(theProductId).subscribe(
      data=>{
        this.product=data;
      }
    )
  }

  addToCart(){
    const theCartItem=new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }

}
