import Product from "./Product";
import { Link } from 'react-router-dom';

const TrackList = ({ products, deleteProduct }) => {
    return (
        <div className="products">
            <div className="title">
                Товары <span className="amount">• {products.length}</span>
            </div>
            <div className="inner-products">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <div
                                    className="table-header"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    Фотография
                                </div>
                            </th>
                            <th>
                                <div className="table-header">
                                    Название
                                </div>
                            </th>
                            <th>
                                <div
                                    className="table-header"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    Статус
                                </div>
                            </th>
                            <th>
                                <div
                                    className="table-header"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    Цена (Макс.)
                                </div>
                            </th>
                            <th>
                                <div
                                    className="table-header"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    Удалить
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map(product =>
                                <Product data={product} deleteProduct={deleteProduct} key={product._id} />
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TrackList;