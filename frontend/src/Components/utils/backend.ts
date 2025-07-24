import axios, { AxiosResponse, type AxiosInstance } from 'axios'
import type { SweepData } from '../interfaces/interfaces'
import { BackendUrl } from '../../config'

class SweepsClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({ baseURL: BackendUrl })
  }


  public getSweepData = async (id: number, startDate : string, endDate : string): Promise<SweepData> => {
    try {
      const response: AxiosResponse = await this.instance.post<SweepData>('get_data', {id, startDate, endDate})
      return response.data
    } 
    catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }}


  export default SweepsClient