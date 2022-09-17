import Input from "./UI/Input/Input";

const CityPrice = ({ city, product, setProduct }) => {
    return (
        <div className="price-table-row">
            <div className="price-table-data">{city.name}</div>
            <div className="price-table-data">
                <Input
                    value={city.price}
                    onChange={(e) => {
                        const copyProduct = { ...product };
                        copyProduct.pricelist[city.id].price = e.target.value;
                        setProduct(copyProduct);
                    }}
                    type="number"
                    placeholder="Цена"
                />
            </div>
        </div>
    );
}

export default CityPrice;