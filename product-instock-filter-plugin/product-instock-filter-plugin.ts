import gql from 'graphql-tag';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductResolver } from './product.resolver';

@VendurePlugin({
    imports: [PluginCommonModule],
    //providers: [ProductService],
    adminApiExtensions: {
        schema: gql`
        extend input ProductListOptions   {
          inStock: Boolean
        }`,
      resolvers: [ProductResolver]
    },
    shopApiExtensions: {
        schema: gql`
        extend input ProductListOptions   {
          inStock: Boolean
        }`,
      resolvers: [ProductResolver]
    },
  })
  
  export class productInStockFilterPlugin {}