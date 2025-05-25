import axios from 'axios';
import {ApiResponse, HelpRequest} from '@/types/app/api';

export const fetchHelpRequests = async (): Promise<
  HelpRequest[] | undefined
> => {
  const {data} = await axios.get<ApiResponse<HelpRequest[]>>(
    `/api/help-requests/get`,
  );
  return data?.data;
};
