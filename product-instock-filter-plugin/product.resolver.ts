import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    Permission,
    QueryProductsArgs
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { Translated } from '@vendure/core/src/common/types/locale-types';
import { Product } from '@vendure/core/src/entity/product/product.entity';
import { ProductService } from '@vendure/core/src/service/services/product.service';
import { ProductVariantService } from '@vendure/core/src/service/services/product-variant.service';
import { Allow } from '@vendure/core';
import { RequestContext } from '@vendure/core/src/api/common/request-context';
import { Ctx } from '@vendure/core';

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
