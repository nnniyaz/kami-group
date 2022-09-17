import { useMemo } from 'react';
import trash from '../assets/svgs/trash.svg';
import { Link } from 'react-router-dom'

const Product = ({ data, deleteProduct }) => {
    const handleClick = () => {
        window.location.href = `products/edit/${data._id}`
    }

    const handleDelete = async () => {
        deleteProduct(data._id)
    }

    const maxPrice = useMemo(() => {
        const priceArray = [];
        for (let i = 0; i < data.pricelist.length; i++) {
            priceArray.push(data.pricelist[i].price);
        }

        let max = priceArray[0];
        for (let i = 0; i < data.pricelist.length; i++) {
            if (max < priceArray[i]) {
                max = priceArray[i];
            }
        }

        return max;
    }, [])

    return (
        <tr className='row'>
            <td className="product-block" onClick={handleClick}>
                <img className="product-image" src={'http://localhost:5000/' + data.images[0]} alt="product" />
            </td>
            <td onClick={handleClick}>
                {data.name}
            </td>
            <td onClick={handleClick}>
                <div className="product-status">
                    <div
                        className={data.status === 'active' ? "status-active" : "status-notactive"}
                    >
                        {data.status === 'active' ? 'Активный' : 'Архивный'}
                    </div>
                </div>
            </td>
            <td onClick={handleClick}>
                <div className='product-price'>
                    {maxPrice}
                </div>
            </td>
            <td>
                <div className='icon-block' onClick={handleDelete}>
                    <img className="trash-icon" src={trash} alt="icon" />
                </div>
            </td>
        </tr >
    );
}

export default Product;