import React, { useState } from 'react'
import useGetLpList from '../hooks/queries/useGetLpList'

const HomePage = () => {
    const [search, setSearch] = useState("");
    const {data, isPending, isError} = useGetLpList({
        search,
    });


    if (isPending) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error...</div>
    }

    return (
        <div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} />
            {data?.data.data.map((lp) => <h1>{lp.title}</h1>)}
        </div>
    )
}

export default HomePage
