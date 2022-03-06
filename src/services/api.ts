import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://172.24.253.61:3000/api',
})