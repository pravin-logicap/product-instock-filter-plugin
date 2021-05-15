# product-instock-filter-plugin
 This is a one-off plugin for the [Vendure e-commerce framework](https://www.vendure.io/).
 one-off plugin can be used for spacific project by simply nest those plugins into the project source, as is demonstrated by the [real-world-vendure folder structure](https://github.com/vendure-ecommerce/real-world-vendure)

 ## In Vendure config
 Add above plugin in src and config into vendure config as mentioned.

 ```typescript
import { productInStockFilterPlugin } from "product-instock-filter-plugin";

export const config: VendureConfig = {
  ...
  plugins: [
    ...,
    productInStockFilterPlugin
  ]
}
```

```Query
query{
  products(options:{take:4, inStock:true}):Product!
}
```
Above query will not return product which does not have stock.