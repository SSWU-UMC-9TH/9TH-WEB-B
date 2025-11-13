import { axiosInstance } from '../axios';
import type {
  LpListParams,
  LpListResponse,
  LpDetailResponse,
  CreateLpRequest,
  CreateLpResponse
} from '../../types/lp';

// LP 목록 조회 (실제 백엔드 API, 실패 시 mockData 사용)
export const getLpList = async (params?: LpListParams): Promise<LpListResponse> => {
  try {
    console.log('전체 LP 목록 API 요청 시작:', params);
    
    // 공용 LP 목록 엔드포인트 사용 (특정 사용자가 아닌 전체 LP)
    const response = await axiosInstance.get('/v1/lps', { params });
    console.log('전체 LP 목록 API 응답:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('전체 LP 목록 요청 실패:', error);
    console.error('⚠️ 백엔드 서버가 실행 중인지 확인해주세요 (localhost:8000)');
    
    // 실제 백엔드 연결을 우선하므로 에러를 그대로 throw
    throw error;
  }
};

// LP 상세 조회 (실제 백엔드 API, 실패 시 mockData 사용)
export const getLpDetail = async (lpId: string): Promise<LpDetailResponse> => {
  try {
    console.log('LP 상세 요청 시작:', lpId);
    
    const response = await axiosInstance.get(`/v1/lps/${lpId}`);
    console.log('LP 상세 API 응답:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('LP 상세 요청 실패:', error);
    console.error('⚠️ 백엔드 서버가 실행 중인지 확인해주세요 (localhost:8000)');
    
    // 실제 백엔드 연결을 우선하므로 에러를 그대로 throw
    throw error;
  }
};

// 특정 사용자 LP 목록 조회
export const getUserLpList = async (
  userId: string,
  params?: Omit<LpListParams, 'userId'>
): Promise<LpListResponse> => {
  try {
    console.log('사용자별 LP 목록 API 요청 시작:', userId, params);
    
    // 특정 사용자의 LP만 가져오는 엔드포인트
    const response = await axiosInstance.get(`/v1/lps/user/${userId}`, { params });
    console.log('사용자별 LP 목록 API 응답:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('사용자별 LP 목록 요청 실패:', error);
    throw error;
  }
};

// LP 생성 (실제 백엔드 API, 파일 없이)
export const createLp = async (data: CreateLpRequest): Promise<CreateLpResponse> => {
  try {
    console.log('LP 생성 요청:', data);
    const response = await axiosInstance.post('/v1/lps', data);
    console.log('LP 생성 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('LP 생성 실패:', error);
    throw error;
  }
};

// LP 수정 (실제 백엔드 API)
export const updateLp = async (
  lpId: string,
  data: Partial<CreateLpRequest>
): Promise<CreateLpResponse> => {
  try {
    console.log('LP 수정 요청:', lpId, data);
    
    const response = await axiosInstance.patch(`/v1/lps/${lpId}`, data);
    console.log('LP 수정 API 응답:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('LP 수정 실패:', error);
    throw error;
  }
};

// LP 삭제 (실제 백엔드 API)
export const deleteLp = async (lpId: string): Promise<{ status: boolean; message: string }> => {
  try {
    console.log('LP 삭제 요청:', lpId);
    
    const response = await axiosInstance.delete(`/v1/lps/${lpId}`);
    console.log('LP 삭제 API 응답:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('LP 삭제 실패:', error);
    throw error;
  }
};


