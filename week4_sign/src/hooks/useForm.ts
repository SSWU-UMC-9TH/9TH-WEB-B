import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initialValue: T; // {email: '', password: ''}
    // 값이 올바른지 검증하는 함수
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({initialValue, validate}: UseFormProps<T>) {
    const [values, setValues] = useState(initialValue);
    // 빈 객체로 초기화하여 첫 사용 시 스프레드(...) 에러 방지
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 사용자가 입력값을 바꿀 때 실행되는 함수
    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values, // 기존값 유지
            [name]: text,
        })
    }
    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true,
        })
    }

    const getInputProps = (name: keyof T) => {
        const value = values[name];
        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            handleChange(name, e.target.value);
        }
        const onBlur = () => handleBlur(name);

        return {value, onChange, onBlur};
    }

    // values가 변경될 때마다 에러 검증 로직 실행
    useEffect(() => {
        // validate는 컴포넌트에서 inline으로 생성될 수 있으므로
        // 참조가 매 렌더마다 바뀌어 무한 렌더가 발생할 수 있다.
        // 값이 변경될 때만 검증을 실행한다.
        const newErrors = validate(values);
        setErrors(newErrors);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values])

    return {values, errors, touched, getInputProps};
}

export default useForm;

