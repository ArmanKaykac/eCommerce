import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[]=[];
  currentCategoryId: number=1;
  previousCategoryId: number=1;
  searchMode:boolean=false;


  thePageNumber:number=1;
  thePageSize:number=8;
  theTotalElements:number=0;

  previousKeyword: string=null;

  constructor(private productService: ProductService,
              private route:ActivatedRoute,
              private cartService:CartServiceService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {

      this.listProducts();
    });

  }

  listProducts(){
    this.searchMode=this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }
  handleSearchProducts() {
    const theKeyword:string=this.route.snapshot.paramMap.get('keyword');


    if(this.previousKeyword != theKeyword){
      this.thePageNumber=1;
    }

    this.previousKeyword=theKeyword;

    this.productService.searchProductListPaginate(this.thePageNumber-1,
                                                  this.thePageSize,
                                                  theKeyword).subscribe(
                                                    this.processResult()
                                                  );       
    
    
  }

  handleListProducts(){

    const hasCategoryId: boolean=this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId=+this.route.snapshot.paramMap.get('id');
    }
    else {
      this.currentCategoryId=1;
    }   

    if (this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }


    this.previousCategoryId = this.currentCategoryId;
 
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(tempProduct:Product){
    

    const theCartItem=new CartItem(tempProduct);
    this.cartService.addToCart(theCartItem);
  }


}

