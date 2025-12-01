import React from "react";
import { useSelector, useDispatch } from "../hooks/useCustomRedux";
import { openModal } from "../slices/ModalSlice";

const PriceBox = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { total } = useSelector((state) => state.cart);

    // 버튼 클릭 시 모달 오픈
    const handleOpenModal = (): void => {
        dispatch(openModal());
    };

    return (
        <div className="p-12 flex justify-end gap-10">
            <button
                onClick={handleOpenModal}
                className='border p-1 text-sm rounded-md cursor-pointer'>
                전체 삭제
            </button>
            <div className="p-2 mr-80 flex bg-gray-200">총 가격: {total}원</div>
        </div>
    );
};

export default PriceBox;