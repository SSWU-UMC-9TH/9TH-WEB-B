import { WelcomeData } from './components/UserDataDisplay';
import {QueryClient, QueryClientProvider} from  '@tanstack/react-query'

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client = {queryClient}>
            <WelcomeData />
        </QueryClientProvider> // 쿼리 로직을 쓸 수 있음
    )
}

export default App
