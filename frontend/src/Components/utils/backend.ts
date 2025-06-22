import axios, { AxiosResponse, type AxiosInstance } from 'axios'
import { VITE_BACKEND_URL } from '../../config'
import { GraphData } from '../interfaces/interfaces'


class AxiosService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({ baseURL: VITE_BACKEND_URL })
  }


  public getData = async (id: number): Promise<GraphData> => {
        try {
        const response: AxiosResponse = await this.instance.post<GraphData>('get_data', {id})
        return response.data
        } catch (error) {
        console.error('Error fetching data:', error)
        throw error
        }
    }}
    export default AxiosService