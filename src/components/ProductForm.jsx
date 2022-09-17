import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Button from "./UI/Button/Button";
import Input from "./UI/Input/Input";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import plus from '../assets/svgs/plus.svg';
import trash from '../assets/svgs/trash.svg';
import arrow from '../assets/svgs/chevron-left.svg';
import CityPrice from "./CityPrice";
import ProductService from "../API/ProductService";

const ProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        images: [],
        status: '',
        pricelist: [{ id: 0, name: 'Все города', price: '' }]
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [forAllCities, setForAllCities] = useState(true);

    useEffect(() => {
        const fetchCities = async () => {
            const data = await ProductService.getCities();
            const pricelist = data.map(item => {
                item.price = '';
                return item;
            });
            setProduct({ ...product, pricelist: [product.pricelist[0], ...pricelist] });
        }

        fetchCities();
    }, [forAllCities])

    const onSelectFile = (e) => {
        const files = e.target.files;
        const filesArray = Array.from(files);
        const imagesArray = filesArray.map(file => {
            return URL.createObjectURL(file);
        })

        setSelectedFiles((previousFiles) => previousFiles.concat(filesArray));
        setSelectedImages((previousImages) => previousImages.concat(imagesArray));
        e.target.value = null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProduct = {
            ...product,
            description: product.description.split('>')[1].split("<")[0],
            images: selectedFiles,
        }

        if (!newProduct.name) {
            alert('Пожалуйста, заполните название товара!');
            return;
        }

        if (!newProduct.description) {
            alert('Пожалуйста, заполните описание товара!');
            return;
        }

        if (newProduct.images.length === 0) {
            console.log(newProduct)
            alert('Пожалуйста, добавьте изображение товара!');
            return;
        }

        if (!newProduct.status) {
            alert('Пожалуйста, определите статус товара!');
            return;
        }

        if (forAllCities) {
            if (!newProduct.pricelist[0].price || newProduct.pricelist[0].price === 0) {
                alert('Единая цена для всех городов не указана.')
                return;
            }

            if (!newProduct.pricelist[0].price[0] === '-' ||
                (!newProduct.pricelist[0].price[0] === '0' &&
                    !newProduct.pricelist[0].price.length > 1)) {
                alert('Некорректная цена для товара.');
                return;
            }

            newProduct.pricelist[0].price = parseInt(newProduct.pricelist[0].price);
            newProduct.pricelist.slice(1,).map(city => {
                city.price = 0;
                return city;
            })
        }

        if (!forAllCities) {
            let emptyPrice = false;
            let wrongPriceInput = false;
            newProduct.pricelist.slice(1,).map(city => {
                if (!city.price) {
                    emptyPrice = true;
                }

                if (city.price[0] === '-' || (city.price[0] === '0' && city.price.length > 1)) {
                    wrongPriceInput = true;
                }

                else {
                    city.price = parseInt(city.price);
                }
                return city;
            })

            if (emptyPrice) {
                alert('Пожалуйста, укажите цену для каждого города.');
                return;
            }

            if (wrongPriceInput) {
                alert('Некорректная цена для товара.');
                return;
            }

            newProduct.pricelist[0].price = 0;
        }

        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("description", newProduct.description);
        newProduct.images.forEach((file, index) => {
            formData.append(`productPhotos${index}`, file);
        })
        formData.append("status", newProduct.status);
        formData.append(`pricelist`, JSON.stringify(newProduct.pricelist));
        await ProductService.create(formData);

        setProduct(
            {
                name: '',
                description: '',
                images: [],
                status: '',
                pricelist: [{ id: 0, name: 'Все города', price: '' }]
            }
        )
        setProduct({ ...product, name: '' });
        setProduct({ ...product, description: '' });
        setProduct({ ...product, pricelist: [{ id: 0, name: 'Все города', price: '' }] });
        setSelectedFiles([]);
        setSelectedImages([]);
        setForAllCities(true);
        window.location.href = `/products`;
    }

    return (
        <div className="App" style={{ minHeight: '100vh', padding: '20px 0' }}>
            <Link to="/products" className="back">
                <img className="back-icon" src={arrow} alt="go back" />
                Вернуться
            </Link>
            <div className="title" >
                Создайте товар
            </div>
            <form className="form">

                <div className="label">
                    <div className="label-text">
                        Название
                    </div>
                    <Input
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        type='text'
                        placeholder='Название товара'
                    />
                </div>

                <label className="label">
                    <div className="label-text">
                        Описание
                    </div>
                    <ReactQuill
                        theme="snow"
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e })}
                        className='description'
                        placeholder="Описание товар"
                    />
                </label>

                <div className="add-image-block">
                    <div className="add-image-text" style={{ color: selectedImages.length > 3 ? 'red' : '' }}>
                        <div>Добавьте изображения товара ({selectedImages.length}/3)</div>
                        {
                            selectedImages.length > 3
                            &&
                            (
                                <div>
                                    <br />
                                    Нужно удалить {selectedImages.length - 3} {selectedImages.length - 3 === 1 ? 'фотографию' : 'фотографии'}
                                </div>
                            )
                        }
                    </div>
                    <div className="images">
                        {
                            selectedImages
                            &&
                            (
                                selectedImages.map(pic => {
                                    return (
                                        <div className="preview-block" key={pic}>
                                            <img className="preview" src={pic} alt="preview" />
                                            <img
                                                className="preview-delete"
                                                src={trash}
                                                alt="trash"
                                                onClick={(e) => setSelectedImages(selectedImages.filter((event) => event !== pic))}
                                            />
                                        </div>
                                    );
                                })
                            )
                        }
                        {
                            selectedImages.length < 3
                            &&
                            (
                                <label className="square">
                                    <img className="plus-icon" src={plus} alt="plus-icon" />
                                    <div className="plus-text">Добавить фото</div>
                                    <input
                                        style={{ display: 'none' }}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={onSelectFile}
                                    />
                                </label>
                            )
                        }
                    </div>
                </div>

                <div className="label">
                    <div className="status-text">Выберите статус</div>
                    <div className="status-block">
                        <label className="status-block-label">
                            <input
                                className="status-block-radio"
                                type="radio"
                                value="active"
                                name="status"
                                onChange={(e) => setProduct({ ...product, status: e.target.value })}
                            />
                            <div className="status-block-text">
                                Активный
                            </div>
                        </label>
                        <label className="status-block-label">
                            <input
                                className="status-block-radio"
                                type="radio"
                                value="archival"
                                name="status"
                                onChange={(e) => setProduct({ ...product, status: e.target.value })}
                            />
                            <div className="status-block-text">
                                Архивный
                            </div>
                        </label>
                    </div>
                </div>

                <div className="label">
                    <div className="price-text">Цены</div>
                    <div className="price-block">
                        <div className="price-block-row">
                            <label className="price-block-label">
                                <input
                                    type="checkbox"
                                    className="price-block-checkbox"
                                    checked={forAllCities}
                                    onChange={() => setForAllCities(!forAllCities)}
                                />
                                <div className="price-block-text" style={{ opacity: !forAllCities ? '0.3' : 1 }}>
                                    Одна цена для всех городов
                                </div>
                            </label>
                            <Input
                                value={product.pricelist[0].price}
                                onChange={(e) => {
                                    const copyProduct = { ...product };
                                    copyProduct.pricelist[0].price = e.target.value;
                                    setProduct(copyProduct);
                                }}
                                disabled={!forAllCities ? true : false}
                                style={{ width: '50%', opacity: !forAllCities ? '0.3' : 1 }}
                                type="number"
                                placeholder="Цена товара"
                            />
                        </div>

                        {
                            !forAllCities
                            &&
                            (
                                <div className="price-table">
                                    <div className="price-table-row">
                                        <div className="price-table-head">Город</div>
                                        <div className="price-table-head">Цена</div>
                                    </div>

                                    {
                                        product.pricelist.slice(1,).map(city =>
                                            <CityPrice city={city} product={product} setProduct={setProduct} key={city.id} />
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="btns">
                    <Link to='/products' className="btn-cancel">Отмена</Link>
                    <Button onClick={handleSubmit}>Сохранить</Button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;