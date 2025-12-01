import type { LpData } from '../types/lp';

export const mockLpData: LpData[] = [
  {
    id: '1',
    title: 'Sunday Morning',
    content: 'Rain is falling outside, but I am feeling good inside.',
    thumbnail: 'https://loremflickr.com/400/400/vinyl?random=1',
    published: true,
    authorId: '1',
    createdAt: '2024-11-08T10:30:00.000Z',
    updatedAt: '2024-11-08T10:30:00.000Z',
    tags: [
      { id: '1', name: 'Jazz' },
      { id: '2', name: 'Chill' },
    ],
    likes: [
      { id: '1', userId: '1', lpId: '1' },
    ],
    author: {
      id: '1',
      nickname: 'musiclover',
    }
  },
  {
    id: '2',
    title: 'Midnight Blues',
    content: 'Late night vibes with smooth blues.',
    thumbnail: 'https://loremflickr.com/400/400/vinyl?random=2',
    published: true,
    authorId: '2',
    createdAt: '2024-11-07T22:15:00.000Z',
    updatedAt: '2024-11-07T22:15:00.000Z',
    tags: [
      { id: '3', name: 'Blues' },
    ],
    likes: [],
    author: {
      id: '2',
      nickname: 'BluesLover',
    }
  },
  {
    id: '3',
    title: 'Golden Hour Vibes',
    content: '황금빛 노을과 함께하는 완벽한 음악',
    thumbnail: 'https://loremflickr.com/400/400/vinyl?random=3',
    published: true,
    authorId: '3',
    createdAt: '2024-11-09T18:45:00.000Z',
    updatedAt: '2024-11-09T18:45:00.000Z',
    tags: [
      { id: '4', name: 'Pop' },
      { id: '5', name: 'Sunset' },
    ],
    likes: [
      { id: '2', userId: '2', lpId: '3' },
      { id: '3', userId: '3', lpId: '3' },
    ],
    author: {
      id: '3',
      nickname: 'sunsetdreamer',
    }
  },
  {
    id: '4',
    title: 'Electric Nights',
    content: '전자음악과 함께하는 밤의 여행',
    thumbnail: 'https://loremflickr.com/400/400/vinyl?random=4',
    published: true,
    authorId: '4',
    createdAt: '2024-11-10T02:20:00.000Z',
    updatedAt: '2024-11-10T02:20:00.000Z',
    tags: [
      { id: '6', name: 'Electronic' },
      { id: '7', name: 'Dance' },
    ],
    likes: [
      { id: '4', userId: '1', lpId: '4' },
    ],
    author: {
      id: '4',
      nickname: 'electrobeat',
    }
  },
  {
    id: '5',
    title: 'Acoustic Dreams',
    content: '어쿠스틱 기타로 만든 꿈같은 선율',
    thumbnail: 'https://loremflickr.com/400/400/vinyl?random=5',
    published: true,
    authorId: '5',
    createdAt: '2024-11-06T14:10:00.000Z',
    updatedAt: '2024-11-06T14:10:00.000Z',
    tags: [
      { id: '8', name: 'Acoustic' },
      { id: '9', name: 'Folk' },
    ],
    likes: [],
    author: {
      id: '5',
      nickname: 'guitardream',
    }
  },
  {
    id: '6',
    title: 'Neo Soul Paradise',
    content: '현대적 소울 음악의 정수를 담은 LP',
    thumbnail: 'https://loremflickr.com/400/400/vinyl?random=6',
    published: true,
    authorId: '6',
    createdAt: '2024-11-05T11:30:00.000Z',
    updatedAt: '2024-11-05T11:30:00.000Z',
    tags: [
      { id: '10', name: 'Soul' },
      { id: '11', name: 'R&B' },
    ],
    likes: [
      { id: '5', userId: '2', lpId: '6' },
      { id: '6', userId: '4', lpId: '6' },
      { id: '7', userId: '5', lpId: '6' },
    ],
    author: {
      id: '6',
      nickname: 'soulkeeper',
    }
  }
];

export const getMockLpList = (params?: any) => {
  return {
    status: true,
    statusCode: 200,
    message: 'Success',
    data: {
      data: mockLpData,
      nextCursor: null,
      hasNext: false
    }
  };
};

export const getMockLpDetail = (lpId: string) => {
  const lp = mockLpData.find(item => item.id === lpId);
  return {
    status: true,
    statusCode: 200,
    message: 'Success',
    data: lp || mockLpData[0]
  };
};

export const getMockComments = (lpId: string, params: { order: "asc" | "desc"; cursor: number; limit: number; }) => {
  // Mock 댓글 데이터 생성
  const mockComments = [
    {
      id: '1',
      content: '정말 좋은 LP네요! 매일 듣고 있어요.',
      lpId: lpId,
      authorId: '1',
      createdAt: '2024-11-10T15:30:00.000Z',
      updatedAt: '2024-11-10T15:30:00.000Z',
      author: { id: '1', nickname: 'musicfan123' }
    },
    {
      id: '2',
      content: '이 LP 덕분에 새로운 장르를 알게 되었습니다. 감사해요!',
      lpId: lpId,
      authorId: '2',
      createdAt: '2024-11-10T14:20:00.000Z',
      updatedAt: '2024-11-10T14:20:00.000Z',
      author: { id: '2', nickname: 'vinyllover' }
    },
    {
      id: '3',
      content: '음질이 정말 깔끔하네요. 추천합니다!',
      lpId: lpId,
      authorId: '3',
      createdAt: '2024-11-10T13:10:00.000Z',
      updatedAt: '2024-11-10T13:10:00.000Z',
      author: { id: '3', nickname: 'audiophile' }
    },
    {
      id: '4',
      content: '노스탤지어한 감정이 느껴져서 좋아요',
      lpId: lpId,
      authorId: '4',
      createdAt: '2024-11-10T12:05:00.000Z',
      updatedAt: '2024-11-10T12:05:00.000Z',
      author: { id: '4', nickname: 'retroman' }
    },
    {
      id: '5',
      content: 'LP 컬렉션에 추가했습니다. 완벽해요!',
      lpId: lpId,
      authorId: '5',
      createdAt: '2024-11-10T11:00:00.000Z',
      updatedAt: '2024-11-10T11:00:00.000Z',
      author: { id: '5', nickname: 'collector99' }
    }
  ];

  // 정렬 적용
  const sortedComments = params.order === 'desc' 
    ? mockComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : mockComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // 페이징 처리
  const start = params.cursor;
  const end = start + params.limit;
  const paginatedComments = sortedComments.slice(start, end);

  return {
    status: true,
    statusCode: 200,
    message: 'Success',
    data: {
      data: paginatedComments,
      nextCursor: end < sortedComments.length ? end : null,
      hasNext: end < sortedComments.length
    }
  };
};

export const createMockComment = (content: string, lpId: string) => {
  return {
    status: true,
    statusCode: 201,
    message: 'Success',
    data: {
      id: Date.now().toString(),
      content,
      lpId,
      authorId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: { id: '1', nickname: 'CurrentUser' }
    }
  };
};

export const getMockSignup = (userData: any) => {
  return {
    status: true,
    statusCode: 201,
    message: 'Signup successful',
    data: {
      id: parseInt(Date.now().toString().slice(-6)),
      name: userData.nickname,
      email: userData.email,
      bio: '',
      avatar: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };
};

export const getMockSignin = (credentials: any) => {
  // 이메일 기반으로 사용자 이름 생성
  const userName = credentials.email ? credentials.email.split('@')[0] : '사용자';
  
  return {
    status: true,
    statusCode: 200,
    message: 'Login successful',
    data: {
      id: parseInt(Date.now().toString().slice(-6)),
      name: userName,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    }
  };
};

