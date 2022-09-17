import { useEffect, useState } from 'react';
import './App.css';
import Search from './components/Search';
import ProductList from './components/ProductList';
import Button from './components/UI/Button/Button';
import { useProducts } from './hooks/useProduct';
import ProductService from './API/ProductService';
import Loader from './components/UI/Loader/Loader';
import { useFetching } from './hooks/useFetching';
import { getPageCount, getPagesArray } from './utils/pages';
import { Link } from 'react-router-dom'
import previosPage from './assets/svgs/chevron-left.svg';
import nextPage from './assets/svgs/chevron-right.svg';

function App() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ query: '' })
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalNumberOfProducts, setTotalNumberOfProducts] = useState(0);
  const sortedAndSearchedProducts = useProducts(products, filter);
  const pagesArray = getPagesArray(totalPages);

  const [fetchProducts, isLoading, errorMessage] = useFetching(async () => {
    const list = await ProductService.getAll(limit, page);
    setProducts(list.products);
    const totalCount = list.total;
    setTotalNumberOfProducts(list.total);
    setTotalPages(getPageCount(totalCount, limit));
  })

  const deleteProduct = async (id) => {
    setProducts(products.filter(product => product._id !== id));
    await ProductService.delete(id);
  }

  useEffect(() => {
    fetchProducts()
  }, [page, limit])

  const changePage = (page) => {
    setPage(page);
  }

  const goPreviousPage = () => {
    if (page === 1) {
      return
    }
    setPage(page - 1);
  }

  const goNextPage = () => {
    if (page === pagesArray[pagesArray.length - 1]) {
      return
    }
    setPage(page + 1);
  }

  const changeLimit = (limit) => {
    setLimit(limit);
  }

  return (
    <div className="App">
      <Link to='create'>
        <Button style={{ width: '20%' }}>
          Добавить
        </Button>
      </Link>

      <hr style={{ margin: '20px 0' }} />

      <div className='container'>
        <Search filter={filter} setFilter={setFilter} />

        <div className='inner-container'>
          {
            errorMessage
              ?
              <h1>Произошла ошибка {errorMessage}</h1>
              :
              isLoading
                ?
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Loader />
                </div>
                :
                <div className='content'>
                  <ProductList products={sortedAndSearchedProducts} deleteProduct={deleteProduct} totalNumber={totalNumberOfProducts} />
                  <div className='page__wrapper'>
                    <div className='pages'>
                      <span onClick={goPreviousPage} className='page'>
                        <img src={previosPage} alt="previous page" />
                      </span>
                      {pagesArray.map(p =>
                        <span
                          onClick={() => changePage(p)}
                          key={p}
                          className={page === p ? 'page page__current' : 'page'}
                        >
                          {p}
                        </span>
                      )}
                      <span onClick={goNextPage} className='page'>
                        <img src={nextPage} alt="previous page" />
                      </span>
                    </div>
                    <div className='limits'>
                      {
                        [3, 5, 10].map(l =>
                          <span
                            onClick={() => changeLimit(l)}
                            key={l}
                            className={limit === l ? 'limit limit__current' : 'limit'}>
                            {l}
                          </span>
                        )
                      }
                    </div>
                  </div>
                </div>
          }
        </div>
      </div >
    </div >
  );
}

export default App;
