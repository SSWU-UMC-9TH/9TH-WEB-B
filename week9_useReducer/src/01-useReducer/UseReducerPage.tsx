import { useReducer, useState } from "react";
//state에 대한 unterface
interface IState{
  counter:number;
}
//reducer에 대한 interface,, dispatch를 액션 활용해 카운터 값을 변형시킴
interface IAction{
  type: 'INCREASE' | 'DECREASE'| 'RESET_TO_ZERO' ;
  payload?:number;

}

function reducer(state:IState, action:IAction): IState{
  const {type, payload} = action;
  console.log(action);
  console.log(state);


  switch(type){
    case 'INCREASE':
      return {
        ...state,
        counter: state.counter + (payload ?? 1),
      };
    case 'DECREASE':
      return {
        ...state,
        counter: state.counter - (payload ?? 1),
      };
    case 'RESET_TO_ZERO':
      return {
        ...state,
        counter: 0, 
      };
    default:
      return state;
  }
}
export default function UseReducerPage() {
//1. useState활용
    const [count, setcount] = useState(0);
    
//2. useReducer활용
const [state, dispatch] = useReducer(reducer,{
  counter:0,});
//dispatch:액션을 발생시키는 함수, 상태에 대해서 어떤 작업을 하기 위해 
//reducer:함수, intirialArg:초기값, init:초기화 함수
 const handleIncrease = () : void => {
        setcount(count + 1);
    };

return (
    <>
    <div className='flex flex-col gap-10'>
    <div>
      <h2 className='text-3xl'>usestate</h2>
      <h2>useState훅 사용: {count}</h2>
      <button onClick={handleIncrease}>Increase</button> 
    </div>
    <div>
      <h2 className='text-3xl'>useReducer</h2>
      <h2>useReducer훅 사용: {state.counter}  </h2>
       <button onClick={() : void =>
        dispatch ({type:'INCREASE',
          payload:3,
        })
       }>Increase(+3)</button> 
       <button onClick={() : void =>
        dispatch ({type:'INCREASE'})
       }>Increase(+1, payload 없음)</button> 
        <button onClick={() : void => 
        dispatch ({type:'DECREASE'})
       }>Decrease</button> 
        <button onClick={() : void => 
        dispatch ({type:'RESET_TO_ZERO'})
       }>Reset to Zero</button> 
    </div>
   </div>
    </>
    
  );
};
