import { useMemo } from "react";

export const useSortedProducts = (products, filter) => {
    const sortedProducts = useMemo(() => {
        return products;
    }, [products])

    return sortedProducts;
}

export const useProducts = (products, filter) => {
    const sortedProducts = useSortedProducts(products, filter);

    const sortedAndSearchedProducts = useMemo(() => {
        return sortedProducts.filter(product =>
            product.name.toLowerCase().includes(filter.query.toLowerCase())
        )
    }, [sortedProducts, filter.query])

    return sortedAndSearchedProducts;
}