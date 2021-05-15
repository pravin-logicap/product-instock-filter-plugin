import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    Permission,
    QueryProductsArgs
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Ctx, Translated, Product, ProductService, ProductVariantService, Allow, RequestContext } from '@vendure/core';

@Resolver()
export class ProductResolver {
    constructor(
        private productService: ProductService,
        private productVariantService: ProductVariantService
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    async products(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductsArgs,
    ): Promise<PaginatedList<Translated<Product>>> {
        let arg = JSON.parse(JSON.stringify(args.options));
        const data = await this.productService.findAll(ctx, args.options || undefined);
        if(args && arg.inStock && arg.inStock === true){
            let products = data.items;
            const items1 = await Promise.all(
                products.map(async product => {
                    const { items: variants } = await this.productVariantService.getVariantsByProductId(ctx, product.id);
                    let outOfStockVariants = variants.filter(v => ((v.stockOnHand !== 0)? true : false));
                    if(outOfStockVariants.length === 0)
                        return false;
            
                    return true;
                })
            ).then((res) => products.filter((_v, index) => res[index]));
            data.items = items1;
        }
        return data;
    }


}
