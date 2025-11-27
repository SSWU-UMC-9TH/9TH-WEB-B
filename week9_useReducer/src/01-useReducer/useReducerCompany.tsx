import { useReducer, useState } from "react";

interface IState{

    deaptment:string;
    error: string | null;
  }

interface IAction{
    type: 'CHANGE_DEPARTMENT'| 'RESET';
    payload:string;
}

function reducer(state:IState, action:IAction): IState{
    const {type, payload} = action;

    switch(type){
        case 'CHANGE_DEPARTMENT':{
            const newDepartment = payload;
            const hasError = newDepartment !== '카드메이커';
            return{
                ...state,
                deaptment: hasError ? state.deaptment : newDepartment,
                error: hasError ? '거부권 행사 가능, 카드 메이커만 입력 가능합니다 ' : null,
            };
            }
        default:
        return state;
    }
}

export default function useReducerCompany() {
    const [state, dispatch] = useReducer(reducer,{
        deaptment:'sw developer',
        error:null,
    });
     //const [error,setError] = useState<string | null>(null); 
     const [department, setDepartment] = useState('');   
    // if (department !== '카드메이커'){
    //     setError('거부권 행사 가능');
    // }else{
    //     setError(null); 
    //     setDepartment(department);
    // };
    const handleChangeDepartment = (e:React.ChangeEvent<HTMLInputElement>) => {
        setDepartment(e.target.value);
    }
    return (
    <div>
        <h1> {state.deaptment}</h1>
        {state.error && <p className='text-red-500 font-2xl'>에러: {state.error}</p>}


        <input 
        className='w-[600px] border mt-10 p-4 rounded-md'
        placeholder='변경하시고 싶은 직무를 입력해주세요'
        value={department} onChange={handleChangeDepartment} />
   
   <button onClick={():void =>
   dispatch({ type: 'CHANGE_DEPARTMENT', payload:
    department })
   }
> 직무 변경하기</button>
   
   </div>);
  }
