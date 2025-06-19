import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { GraphData } from '../../interfaces/interfaces'

class AxiosService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({ baseURL: 'http://127.0.0.1:5000/' })
  }


  public getData = async (id: number): Promise<GraphData> => {
        try {
        const response = await this.instance.post<GraphData>('get_data', {
            id: id
        })
        return response.data
        } catch (error) {
        console.error('Error fetching data:', error)
        throw error
        }
    }}
    export default AxiosService