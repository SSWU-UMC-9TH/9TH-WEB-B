import React, { useEffect, useState } from 'react'
import { useGetInfiniteLpList } from '../hooks/queries/useGetInfiniteLpList';
import { PAGINATION_ORDER } from '../enums/common';
import { useInView } from 'react-intersection-observer';
import LpCard from '../components/LpCard/LpCard';
import LpCardSkeletonList from '../components/LpCard/LpCardSkeletonList';

const HomePage = () => {
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState(PAGINATION_ORDER.desc);
    const {data: lps, isFetching, hasNextPage, isPending, fetchNextPage, isError} = useGetInfiniteLpList(10, search, order);

    // ref: 특정한 HTML 요소를 감시할 수 있다
    // inView: 그 요소가 화면에 보이면 true
    const {ref, inView} = useInView({
        threshold: 0,
    })

    useEffect(() => {
        if (inView) {
            !isFetching && hasNextPage && fetchNextPage();
        }
    }, [inView, isFetching, hasNextPage, fetchNextPage])

    const handleOrder = (newOrder: PAGINATION_ORDER) => {
        setOrder(newOrder);
    }

    if (isError) {
        return <div>Error...</div>
    }

    return (
        <div className='container mx-auto px-4 py-6'>
            <div className='flex justify-between items-center mb-[10px]'>
                <input value={search} onChange={(e) => setSearch(e.target.value)} />
                <div>
                    <button
                        onClick={() => handleOrder(PAGINATION_ORDER.asc)}
                        className={`border border-white rounded-l-[7px] px-[10px] py-[5px] cursor-pointer
                            ${order===PAGINATION_ORDER.asc ? 'bg-white text-black' : 'bg-black text-white'}`}
                    >
                        오래된순
                    </button>
                    <button
                        onClick={() => handleOrder(PAGINATION_ORDER.desc)}
                        className={`border border-white rounded-r-[7px] px-[10px] py-[5px] cursor-pointer
                            ${order===PAGINATION_ORDER.desc ? 'bg-white text-black' : 'bg-black text-white'}`}
                    >
                        최신순
                    </button>
                </div>
            </div>
            <div className='flex flex-wrap justify-between gap-[10px]'>
                {isPending && <LpCardSkeletonList count={20} />}
                {lps?.pages
                    ?.map((page) => page.data.data)
                    ?.flat()
                    ?.map((lp) => <LpCard key={lp.id} lp={lp} />)}
                    {isFetching && <LpCardSkeletonList count={20} />}
                <div ref={ref} className='h-2'></div>
            </div>
        </div>
    )
}

export default HomePage
