import Button from "./components/UI/Button/Button";
import { Link } from 'react-router-dom'

const Main = () => {
    return (
        <div className="main">
            <div className="container">
                <div className="title">Welcome to the Shop</div>
                <Link to='products'>
                    <Button>Enter the Shop</Button>
                </Link>
            </div>
        </div>
    );
}

export default Main;