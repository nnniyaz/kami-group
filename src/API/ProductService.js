import axios from "axios";

const URL = 'https://kami-group.herokuapp.com/api';

export default class ProductService {
    static async getCities() {
        const res = await axios.get(URL + '/cities');
        return res.data;
    }

    static async getAll(limit = 5, page = 1) {
        const res = await axios.get(URL + '/product', {
            params: {
                page: page,
                limit: limit
            }
        })
        return res.data;
    }

    static async create(body) {
        try {
            await axios.post(URL + '/product', body);
        } catch (error) {
            console.log(error)
        }
    }

    static async delete(id) {
        await axios.delete(URL + `/product/${id}`);
    }

    static async getOne(id) {
        const res = await axios.get(URL + `/product/${id}`);
        return res.data;
    }

    static async update(body) {
        await axios.put(URL + `/product`, body);
    }
}